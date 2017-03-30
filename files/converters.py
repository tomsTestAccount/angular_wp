# -*- coding: utf-8 -*-
from datetime import date
from DateTime import DateTime
from datetime import datetime
from datetime import time
from datetime import timedelta
from persistent.list import PersistentList
from persistent.mapping import PersistentMapping
from plone.app.textfield.interfaces import IRichTextValue
from plone.restapi.interfaces import IJsonCompatible
from Products.CMFPlone.utils import getSiteEncoding
from Products.CMFPlone.utils import safe_unicode
from zope.component import adapter
from zope.component.hooks import getSite
from zope.globalrequest import getRequest
from zope.i18n import translate
from zope.i18nmessageid.message import Message
from zope.interface import implementer
from zope.interface import Interface

from lmu.efvmsds.content.student import IAvGrTab

from decimal import *

import Missing


def json_compatible(value):
    """The json_compatible function converts any value to JSON compatible
    data when possible, raising a TypeError for unsupported values.
    This is done by using the IJsonCompatible converters.

    Be aware that adapting the value `None` will result in a component
    lookup error unless `None` is passed in as default value.
    Because of that the `json_compatible` helper method should always be
    used for converting values that may be None.
    """
    return IJsonCompatible(value, None)


@adapter(Interface)
@implementer(IJsonCompatible)
def default_converter(value):
    if value is None:
        return value

    if type(value) in (unicode, bool, int, float, long):
        return value

    raise TypeError(
        'No converter for making'
        ' {0!r} ({1}) JSON compatible.'.format(value, type(value)))


@adapter(str)
@implementer(IJsonCompatible)
def string_converter(value):
    return safe_unicode(value, getSiteEncoding(getSite()))


@adapter(list)
@implementer(IJsonCompatible)
def list_converter(value):
    return map(json_compatible, value)


# XXX: EFV specific converter (mj / 22.03.2017)
@adapter(Decimal)
@implementer(IJsonCompatible)
def decimal_converter(value):
    return str(value)

# XXX: EFV specific converter (mj / 22.03.2017)
#@adapter(IAvGrTab)
#@implementer(IJsonCompatible)
#def avgrtab_converter(value):
#    d = {}
#    for v in value.table:
#        d[v.course] = {'ects': str(v.ects), 'grade': str(v.grade)}
#    d['average'] = str(value.average)
#    return d

@adapter(IAvGrTab)
@implementer(IJsonCompatible)
def avgrtab_converter(value):
    d = {}
    l = []
    for v in value.table:
        row = {'course': str(v.course), 'ects': str(v.ects), 'grade': str(v.grade)}
        l.append(row)
    d['table'] = l
    d['average'] = str(value.average)
    return d

@adapter(PersistentList)
@implementer(IJsonCompatible)
def persistent_list_converter(value):
    return list_converter(value)


@adapter(tuple)
@implementer(IJsonCompatible)
def tuple_converter(value):
    return map(json_compatible, value)


@adapter(frozenset)
@implementer(IJsonCompatible)
def frozenset_converter(value):
    return map(json_compatible, value)


@adapter(set)
@implementer(IJsonCompatible)
def set_converter(value):
    return map(json_compatible, value)


@adapter(dict)
@implementer(IJsonCompatible)
def dict_converter(value):
    if value == {}:
        return {}

    keys, values = zip(*value.items())
    keys = map(json_compatible, keys)
    values = map(json_compatible, values)
    return dict(zip(keys, values))


@adapter(PersistentMapping)
@implementer(IJsonCompatible)
def persistent_mapping_converter(value):
    return dict_converter(value)


@adapter(datetime)
@implementer(IJsonCompatible)
def python_datetime_converter(value):
    return json_compatible(DateTime(value))


@adapter(DateTime)
@implementer(IJsonCompatible)
def zope_DateTime_converter(value):
    return json_compatible(value.ISO8601())


@adapter(date)
@implementer(IJsonCompatible)
def date_converter(value):
    return json_compatible(value.isoformat())


@adapter(time)
@implementer(IJsonCompatible)
def time_converter(value):
    return json_compatible(value.isoformat())


@adapter(timedelta)
@implementer(IJsonCompatible)
def timedelta_converter(value):
    return json_compatible(value.total_seconds())


@adapter(IRichTextValue)
@implementer(IJsonCompatible)
def richtext_converter(value):
    return {
        u'data': json_compatible(value.raw),
        u'content-type': json_compatible(value.mimeType),
        u'encoding': json_compatible(value.encoding),
    }


@adapter(Message)
@implementer(IJsonCompatible)
def i18n_message_converter(value):
    value = translate(value, context=getRequest())
    return value


@adapter(Missing.Value.__class__)
@implementer(IJsonCompatible)
def missing_value_converter(value):
    return None
