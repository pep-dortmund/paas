from wtforms import (Form,
                     StringField,
                     RadioField,
                     IntegerField)
from database import Degree


class RegForm(Form):
    firstname = StringField('Name')
    lastname = StringField('Nachname')
    email = StringField('Email')
    degree = RadioField(
        'Abschluss',
        choices=[(d.id, d.name) for d in Degree.select()],
        coerce=int
    )
    numberOfGuests = IntegerField('Anz. Gäste')
