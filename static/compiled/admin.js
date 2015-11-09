'use strict';

var AdminPanel = React.createClass({
    displayName: 'AdminPanel',

    getInitialState: function getInitialState() {
        return {
            participants: [],
            degrees: {},
            mailExtension: '',
            stats: {},
            registrationIsActive: false,
            order: 'Name_0'
        };
    },
    componentDidMount: function componentDidMount() {
        $.getJSON('/api/config/', (function (data) {
            this.setState({
                degrees: data.degrees,
                mailExtension: data.allowed_mail
            });
        }).bind(this)).fail(function () {
            console.log("Error while downloading degrees.");
        });
        $.getJSON('/admin/api/stats/', (function (data) {
            this.setState({
                stats: data
            });
        }).bind(this)).fail(function () {
            console.log("Error while downloading degrees.");
        });
        $.getJSON('/admin/api/participants/', (function (data) {
            this.setState({ participants: data.participants });
        }).bind(this)).fail(function () {
            console.log('fail');
        });
        $.getJSON('/api/config/', (function (data) {
            this.setState({ registrationIsActive: data.registration_is_active });
        }).bind(this));
    },
    toggleRegistrationStatus: function toggleRegistrationStatus() {
        $.getJSON('/admin/api/toggle_registration/', (function (data) {
            this.setState({ registrationIsActive: data.registration });
        }).bind(this));
    },
    orderBy: function orderBy(e) {
        var parts = [];
        var order = this.state.order;
        var newOrder = '';
        switch (e.currentTarget.innerText) {
            case 'Name':
                {
                    parts = this.state.participants.sort(function (a, b) {
                        switch (order) {
                            case 'Name_0':
                                {
                                    newOrder = 'Name_1';
                                    return a.firstname < b.firstname;
                                }
                            case 'Name_1':
                                {
                                    newOrder = 'Name_2';
                                    return a.lastname > b.lastname;
                                }
                            case 'Name_2':
                                {
                                    newOrder = 'Name_3';
                                    return a.lastname < b.lastname;
                                }
                            default:
                                {
                                    // Name_3
                                    newOrder = 'Name_0';
                                    return a.firstname > b.firstname;
                                }
                        };
                    });
                    break;
                }
            case 'ID':
                {
                    parts = this.state.participants.sort(function (a, b) {
                        switch (order) {
                            case 'ID_0':
                                {
                                    newOrder = 'ID_1';
                                    return a.id < b.id;
                                }
                            default:
                                {
                                    // ID_1
                                    newOrder = 'ID_0';
                                    return a.id > b.id;
                                }
                        }
                    });
                    break;
                }
            case 'Abschluss':
                {
                    parts = this.state.participants.sort(function (a, b) {
                        switch (order) {
                            case 'degree_0':
                                {
                                    newOrder = 'degree_1';
                                    return a.degree < b.degree;
                                }
                            default:
                                {
                                    // degree_1
                                    newOrder = 'degree_0';
                                    return a.degree > b.degree;
                                }
                        }
                    });
                    break;
                }
            case 'Gäste':
                {
                    parts = this.state.participants.sort(function (a, b) {
                        switch (order) {
                            case 'guests_0':
                                {
                                    newOrder = 'guests_1';
                                    return a.guests < b.guests;
                                }
                            default:
                                {
                                    // guests_1
                                    newOrder = 'guests_0';
                                    return a.guests > b.guests;
                                }
                        }
                    });
                    break;
                }
            default:
                undefined;
        };
        this.setState({
            participants: parts,
            order: newOrder
        });
    },
    render: function render() {
        var degreeStats = [];
        for (var key in this.state.stats.degree_counts) {
            if (key in this.state.degrees) {
                degreeStats.push(React.createElement(
                    'span',
                    { key: key },
                    React.createElement(
                        'small',
                        null,
                        this.state.degrees[key].name,
                        ': '
                    ),
                    this.state.stats.degree_counts[key],
                    ' '
                ));
            }
        }
        var head = React.createElement(
            'thead',
            null,
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    { onClick: this.orderBy },
                    'ID'
                ),
                React.createElement(
                    'th',
                    { onClick: this.orderBy },
                    'Name'
                ),
                React.createElement(
                    'th',
                    { onClick: this.orderBy },
                    'Abschluss'
                ),
                React.createElement(
                    'th',
                    null,
                    'Email ',
                    React.createElement(
                        'small',
                        null,
                        this.state.mailExtension
                    )
                ),
                React.createElement(
                    'th',
                    { onClick: this.orderBy },
                    'Gäste'
                ),
                React.createElement(
                    'th',
                    { onClick: this.orderBy },
                    'Verifiziert'
                )
            )
        );
        var body = [];
        body.push(React.createElement(
            'tr',
            { key: -1 },
            React.createElement(
                'td',
                { colSpan: '2' },
                'Total: ',
                this.state.stats.participant_count
            ),
            React.createElement(
                'td',
                { colSpan: '2' },
                degreeStats
            ),
            React.createElement(
                'td',
                null,
                'Total: ',
                this.state.stats.guest_count
            ),
            React.createElement('td', null)
        ));
        for (var key in this.state.participants) {
            var p = this.state.participants[key];
            var degree = p.degree in this.state.degrees ? this.state.degrees[p.degree].name : '...';
            body.push(React.createElement(
                'tr',
                { key: key },
                React.createElement(
                    'td',
                    null,
                    '#',
                    p.id
                ),
                React.createElement(
                    'td',
                    null,
                    p.firstname,
                    ' ',
                    p.lastname
                ),
                React.createElement(
                    'td',
                    null,
                    degree
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'a',
                        { href: 'mailto:' + p.email + this.state.mailExtension },
                        p.email
                    )
                ),
                React.createElement(
                    'td',
                    null,
                    p.guests
                ),
                React.createElement(
                    'td',
                    null,
                    p.verified
                )
            ));
        }
        var registrationButtonLabel = this.state.registrationIsActive ? 'deaktivieren' : 'aktivieren';
        var buttonType = this.state.registrationIsActive ? 'warning' : 'success';
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-xs-6 col-lg-6 col-lg-offset-1 col-xl-5 col-xl-offset-2' },
                    React.createElement(
                        'h4',
                        null,
                        'Adminpanel'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-xs-6 col-lg-4 col-xl-3 text-right' },
                    React.createElement(
                        'span',
                        { id: 'disable-registration' },
                        'Anmeldung ',
                        this.state.registrationIsActive ? 'online' : 'offline',
                        ' ',
                        React.createElement(
                            'button',
                            {
                                className: "btn btn-sm btn-" + buttonType,
                                onClick: this.toggleRegistrationStatus },
                            registrationButtonLabel
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-md-12 col-lg-10 col-lg-offset-1 col-xl-8 col-xl-offset-2' },
                    React.createElement(
                        'table',
                        { className: 'table table-sm table-hover table-striped' },
                        head,
                        React.createElement(
                            'tbody',
                            null,
                            body
                        )
                    )
                )
            )
        );
    }
});

React.render(React.createElement(AdminPanel, null), document.getElementById('admin-panel'));