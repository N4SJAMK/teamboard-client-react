import page from 'page';
import React from 'react/addons';

import User  from '../models/user';
import Board from '../models/board';

import UserStore     from '../stores/user';
import BoardStore    from '../stores/board';
import SettingsStore from '../stores/settings';

import BoardAction     from '../actions/board';
import SettingsAction  from '../actions/settings';
import BroadcastAction from '../actions/broadcast';

import listener from '../mixins/listener';

import Control         from '../components/control';
import Scrollable      from '../components/scrollable';
import Navigation      from '../components/navigation';
import Broadcaster     from '../components/broadcaster';
import BoardComponent  from '../components/board';

import EditBoardDialog   from '../components/dialog/edit-board';
import ExportBoardDialog from '../components/dialog/export-board.js';
import ShareBoardDialog  from '../components/dialog/share-board';
import ReviewView        from '../components/dialog/review-view';

import settingsMixin  from '../mixins/settings';

/**
 * Fix issues with iOS and IScroll not working together too well...
 */
function preventDefault(event) {
    return event.preventDefault();
}

/**
 *
 */
export default React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        user: (props) => {
            if(!props.user instanceof User) throw new Error();
        }
    },

    mixins: [
        listener(UserStore, BoardStore)
    ],

    onChange() {
        return this.setState(this.getState());
    },

    getState() {
        return {
            board:       BoardStore.getBoard(this.props.id) || new Board(),
            snapToGrid:  SettingsStore.getSetting('snap-to-grid'),
            showMinimap: SettingsStore.getSetting('show-minimap')
        }
    },

    getInitialState() {
        return Object.assign(this.getState(), {
            showEditBoardDialog:   false,
            showExportBoardDialog: false,
            showShareBoardDialog:  false,
            reviewActive:          false,
            reviewTickets:         [],
            pollHandle:            null
        });
    },

    componentWillMount() {
        this.setUserActivity({isActive: true, isPoll: false});
    },

    componentDidMount() {
        BoardAction.load(this.props.id);
        document.addEventListener('touchmove', preventDefault);

        // Poll server every 10 seconds to indicate we're still alive!
        let self = this;
        let handle = setInterval(function() {
                self.setUserActivity({isActive:true, isPoll:true})
                }, 10000);
        this.setState({pollHandle: handle});
    },

    // The componentWillUnmount handles exiting the board via the back button.
    componentWillUnmount() {
        if (this.state.pollHandle) {
            clearInterval(this.state.pollHandle);
        }
        if(UserStore.getToken()){
            this.setUserActivity({isActive: false, isPoll: false});
        }
        document.removeEventListener('touchmove', preventDefault);
    },

    toggleEditBoardDialog() {
        this.setState({
            showEditBoardDialog: !this.state.showEditBoardDialog
        });
    },

    toggleExportBoardDialog() {
        this.setState({
            showExportBoardDialog: !this.state.showExportBoardDialog
        });
    },

    toggleReview() {
        if(this.sendTicketsForReview().size !== 0){
            this.setState({ reviewActive: !this.state.reviewActive });
        }
        else {
            BroadcastAction.add({
                type:    'broadcast',
                content: 'You do not have any tickets to review!'
            });
        }
    },

    toggleShareBoardDialog() {
        this.setState({
            showShareBoardDialog: !this.state.showShareBoardDialog
        });
    },

    toggleMagnet() {
        SettingsAction.setSetting('snap-to-grid',
            !this.state.snapToGrid);

        this.setState({
            snapToGrid:  SettingsStore.getSetting('snap-to-grid')
        });
    },

    toggleGlobe() {
        SettingsAction.setSetting('show-minimap',
            !this.state.showMinimap);

        this.setState({
            showMinimap: SettingsStore.getSetting('show-minimap')
        });
    },

    setUserActivity(isActive, isPoll) {
        BoardAction.setUserBoardActivity(this.props.id, isActive, isPoll);
    },

    setReviewClosingButton(mode) {
        this.setState({
            reviewActive: mode
        })
    },

    sendTicketsForReview() {
        // If needed we can use some checks here to filter
        // 	out unneeded tickets here
        return this.state.board.tickets.filter((ticket) => {
            return ticket.content !== "" || ticket.heading !== "" || ticket.comments.size !== 0
        });
    },

    render() {
        let boardDialog = null;
        let reviewDialog = null;

        if(this.state.showEditBoardDialog) {
            boardDialog = <EditBoardDialog board={this.state.board}
                                    onDismiss={this.toggleEditBoardDialog} />
        } else if(this.state.showExportBoardDialog) {
            boardDialog = <ExportBoardDialog board={this.state.board}
                                    onDismiss={this.toggleExportBoardDialog} />

        } else if(this.state.showShareBoardDialog) {
            boardDialog = <ShareBoardDialog board={this.state.board}
                                    onDismiss={this.toggleShareBoardDialog} />
        }

        if(!this.state.reviewActive) {
            reviewDialog = null;
        } else {
            reviewDialog = <ReviewView tickets = {this.sendTicketsForReview()}
            onDismiss = { this.toggleReview } />;
        }

        return (
            <div className="view view-board">
                <Broadcaster />
                <Navigation reviewActive={this.state.reviewActive}
                    killReview={this.setReviewClosingButton}
                    showHelp={true} title={this.state.board.name}
                    showBoardMembers={true} board={this.state.board} />
                <div className="content">
                    <Scrollable board={this.state.board}
                            minimap={this.state.showMinimap}>
                        <BoardComponent selectMode={this.state.selectMode}
                        setReviewTickets={this.setReviewTickets} board={this.state.board}
                            snap={this.state.snapToGrid} />
                    </Scrollable>
                </div>
                {boardDialog}
                {reviewDialog}
                {this.renderControls()}
            </div>
        );
    },

    /**
     * TODO This is a mess, clean up the controls somehow?
     * TODO Use immutable data to prevent constantly re-rendering the controls.
     */
    renderControls() {
        let controls = [
            {
                icon:    'eye',
                active:  this.state.reviewActive,
                onClick: this.toggleReview
            },
            {
                icon:    'download',
                active:  this.state.showExportBoardDialog,
                onClick: this.toggleExportBoardDialog
            },
            {
                onClick: this.toggleMagnet,
                icon:   'magnet',
                active: this.state.snapToGrid
            },
            {
                onClick: this.toggleGlobe,
                icon:   'globe',
                active: this.state.showMinimap
            }
        ];

        let userOnlyControls = [
            {
                onClick: () => {
                    return page.show('/boards')
                },
                icon: 'arrow-left'
            }
        ];

        let adminOnlyControls = [
            {
                icon:    'pencil',
                active:  this.state.showEditBoardDialog,
                onClick: this.toggleEditBoardDialog
            },
            {
                icon:    'share-alt',
                active:  this.state.showShareBoardDialog,
                onClick: this.toggleShareBoardDialog
            }
        ];
        if(this.props.user.type === User.Type.User) {
            let currentRole    = BoardStore.getUserRole(this.state.board.id, this.props.user.id);
            if (currentRole === "admin") {
                controls = adminOnlyControls.concat(controls);
            }

            controls = userOnlyControls.concat(controls);

        }
        return (
            <div className="controls">
                {controls.map((control) => {
                    return <Control key={control.icon} {...control} />;
                })}
            </div>
        );
    }
});
