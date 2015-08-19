function seperateTeX(string){
    var stringArray = [];
    var index = 0;
    while(index > -1){
        index = string.indexOf("$") > -1 ? string.indexOf("$") : string.length;
        string.substring(0, index) ?
            stringArray.push(string.substring(0, index)) : undefined;
        string = string.substring(index + 1, string.length);
        index = string.indexOf("$");
        if(index > -1){
            string.substring(0, index) ?
                stringArray.push("$" + string.substring(0, index)) : undefined;
            string = string.substring(index+1, string.length);
        }
    }
    return stringArray;
}

var NameInput = React.createClass({
    getInitialState: function(){
        return {
            firstname: '',
            lastname: '',
            error: false
        }
    },
    handleChange: function() {
        this.setState({
            firstname: this.refs.firstname.getDOMNode().value,
            lastname: this.refs.lastname.getDOMNode().value
        });
        this.props.onUserInput(this.state.firstname, this.state.lastname);
        if(this.state.error){
            this.check();
        }
    },
    check: function() {
        this.setState({error: (!this.state.firstname || !this.state.lastname)});
    },
    render: function(){
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        var firstnameClasses = React.addons.classSet({
            'form-control': true,
            'form-control-error': this.state.error && !this.state.firstname
        });
        var lastnameClasses = React.addons.classSet({
            'form-control': true,
            'form-control-error': this.state.error && !this.state.lastname,
        });
        var hint = !this.state.error ? '' : (
            <span className="help-block">
                Bitte trage Vor- und Nachnamen ein.
                So wirst du bei der Absolventenfeier aufgerufen.
            </span>);
        return (
            <fieldset className={classes}>
                <label className="control-label">Name</label>
                <div className="row">
                    <div className="col-sm-6">
                        <input
                            className={firstnameClasses}
                            placeholder="Max"
                            ref="firstname"
                            onChange={this.handleChange}/>
                    </div>
                    <div className="col-sm-6">
                        <input
                            className={lastnameClasses}
                            placeholder="Mustermann"
                            ref="lastname"
                            onChange={this.handleChange}/>
                    </div>
                </div>
                {hint}
            </fieldset>
        );
    }
});

var EmailInput = React.createClass({
    getInitialState: function(){
        return {
            error: false
        }
    },
    check: function(){
        this.setState({error: (!this.email || !this.email.match(/^\w+\.\w+$/i))});
    },
    handleChange: function(e){
        var val = e.currentTarget.value;
        this.email = val;
        this.props.onUserInput(val);
        if(this.state.error){
            this.check();
        }
    },
    render: function(){
        var hint = !this.state.error ? '' : (
                <span className="help-block">
                    Bla
                </span>
            );
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        return (
            <fieldset className={classes}>
                <label className="control-label">Unimail-Adresse</label>
                <div className="input-group">
                    <input
                        className="form-control"
                        placeholder="max.mustermann"
                        ref="email"
                        onChange={this.handleChange}/>
                    <div className="input-group-addon">@tu-dortmund.de</div>
                </div>
                {hint}
            </fieldset>
        );
    }
})

var DegreeSelect = React.createClass({
    getInitialState: function(){
        return {
            degrees: [],
        };
    },
    handleChange: function(e){
        this.degree = e.currentTarget.value;
        this.props.onUserInput(this.degree);
    },
    componentDidMount: function(){
        $.getJSON(this.props.source, function(data){
            this.setState({degrees: data});
        }.bind(this))
        .fail(function(){
            console.log("Error while downloading degrees.");
        })
    },
    render: function(){
        var degrees = [];
        for(key in this.state.degrees){
            var degree = this.state.degrees[key];
            degrees.push(
                <label key={degree.id} className="radio-inline">
                    <input name="degree" ref="degree" type="radio" onChange={this.handleChange} value={degree.id}/>{degree.name}
                </label>
            )
        }
        var classes = React.addons.classSet({
            'form-group': true,
            'has-error': this.state.error
        });
        var hint = !this.state.error ? '' : (
                <span className="help-block">
                    Bla
                </span>
            );
        return (
            <fieldset className={classes}>
                <label className="control-label">Abschluss</label>
                <div className="input-group">
                    {degrees}
                </div>
                {hint}
            </fieldset>
        );
    }
})

var ParticipantForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        this.refs.name.check();
        this.refs.email.check();
        return;
    },
    nameInput: function(firstname, lastname){
        console.log(firstname, lastname);
    },
    emailInput: function(email){
        console.log(email);
    },
    degreeInput: function(degree){
        console.log(degree);
    },
    render: function(){
        return (
            <form onSubmit={this.handleSubmit}>
                <NameInput ref="name" onUserInput={this.nameInput} />
                <EmailInput ref="email" onUserInput={this.emailInput} />
                <DegreeSelect ref="degrees" source="/api/degrees/" onUserInput={this.degreeInput}/>
                <input type="submit" className="btn btn-secondary" value="Post" />
            </form>
        );
    }
});

React.render(<ParticipantForm />, document.getElementById('main'));
