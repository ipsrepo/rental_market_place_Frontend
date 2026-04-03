export const SECONDARY = 'secondary';

export const SUCCESS = 'success';

export const TOKEN = 'token';

export const USER = 'user';


export const PROPERTY_TYPES = [
    { value: 'studio',    label: 'Studio' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house',     label: 'House' },
];

export const RENTAL_TYPES = [
    { value: 'entire_place',  label: 'Entire place' },
    { value: 'private_room',  label: 'Private room' },
    { value: 'shared_room',   label: 'Shared room' },
];

export const PRICE_DISPLAY = [
    { value: 'month', label: 'Per month' },
    { value: 'week',  label: 'Per week' },
];

export const BER_RATINGS = [
    { value: 'a1', label: 'A1 — Excellent' },
    { value: 'a2', label: 'A2' },
    { value: 'a3', label: 'A3' },
    { value: 'b1', label: 'B1' },
    { value: 'b2', label: 'B2' },
    { value: 'b3', label: 'B3' },
    { value: 'c1', label: 'C1' },
    { value: 'c2', label: 'C2' },
    { value: 'c3', label: 'C3' },
    { value: 'd1', label: 'D1' },
    { value: 'd2', label: 'D2' },
    { value: 'e1', label: 'E1' },
    { value: 'e2', label: 'E2' },
    { value: 'f',  label: 'F' },
    { value: 'g',  label: 'G — Poor' },
    { value: 'exempt', label: 'Exempt' },
];

export const BEDROOM_OPTIONS  = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export const BATHROOM_OPTIONS = [1, 2, 3, 4, 5];

export const INITIAL_FORM = {
    title:             '',
    details:           '',
    location:          '',
    price:             '',
    pricedisplay:      'month',
    propertytype:      '',
    rentaltype:        'entire_place',
    bedrooms:          1,
    bathrooms:         1,
    isprivatebathroom: false,
    issharedbed:       false,
    isnew:             false,
    billsincluded:     false,
    furnished:         true,
    available:         true,
    availablefrom:     '',
    berrating:         '',
};
