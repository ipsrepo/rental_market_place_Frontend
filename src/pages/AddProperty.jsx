import {useMemo, useRef, useState} from 'react';
import {
    BATHROOM_OPTIONS,
    BEDROOM_OPTIONS,
    BER_RATINGS,
    INITIAL_FORM,
    PRICE_DISPLAY,
    PROPERTY_TYPES,
    RENTAL_TYPES,
    SUCCESS,
    USER
} from "../constants/app.constant.js";
import {addProperty} from "../services/property.service.js";
import {useNavigate} from "react-router-dom";
import {getLocalStorage} from "../utils/localStorage.js";


// ── Reusable field components ────────────────────────────────────────────────

const Label = ({children, required}) => (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {children}
        {required && <span className="text-red ml-0.5">*</span>}
    </label>
);

const Input = ({label, required, error, ...props}) => (
    <div>
        {label && <Label required={required}>{label}</Label>}
        <input
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-accent placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all
        ${error ? 'border-red bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
            {...props}
        />
        {error && <p className="mt-1 text-xs text-red">{error}</p>}
    </div>
);

const Select = ({label, required, error, children, ...props}) => (
    <div>
        {label && <Label required={required}>{label}</Label>}
        <select
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-accent cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all
        ${error ? 'border-red bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
            {...props}
        >
            {children}
        </select>
        {error && <p className="mt-1 text-xs text-red">{error}</p>}
    </div>
);

const Toggle = ({label, description, checked, onChange}) => (
    <div
        className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
        <div>
            <p className="text-sm font-medium text-gray-800">{label}</p>
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                checked ? 'bg-primary' : 'bg-gray-300'
            }`}
        >
      <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
        </button>
    </div>
);

const SectionHeader = ({number, title, subtitle}) => (
    <div className="flex items-start gap-4 mb-5">
        <div
            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
            {number}
        </div>
        <div>
            <h2 className="text-base font-semibold text-accent">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

const ImageUpload = ({images, onAdd, onRemove, label, maxImages = 10}) => {
    const fileRef = useRef();

    const handleFiles = (e) => {
        const files = Array.from(e.target.files);
        onAdd(files);
        e.target.value = '';
    };

    return (
        <div>
            <Label>{label}</Label>
            <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                    <div key={i}
                         className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        <img
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                            alt={`Image ${i + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => onRemove(i)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red text-white rounded-full flex items-center justify-center hover:bg-red transition-colors text-xs font-bold"
                        >
                            ×
                        </button>
                        {i === 0 && (
                            <span
                                className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded font-medium">
                Primary
              </span>
                        )}
                    </div>
                ))}

                {images.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => fileRef.current.click()}
                        className="aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-bg transition-all flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-primary"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/>
                        </svg>
                        <span className="text-xs font-medium">Add photo</span>
                    </button>
                )}
            </div>
            <p className="text-xs text-gray-400 mt-2">First image will be the primary image. Max {maxImages} photos.</p>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles}/>
        </div>
    );
};

const PropertyFormPage = ({existingProperty = null, onSubmit, onCancel}) => {
    const isEdit = !!existingProperty;

    const [form, setForm] = useState(existingProperty || INITIAL_FORM);
    const [images, setImages] = useState(existingProperty?.images || []);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const nav = useNavigate();

    const userId = useMemo(() => getLocalStorage(USER)?._id, []);

    const set = (key, value) => {
        setForm((prev) => ({...prev, [key]: value}));
        if (errors[key]) setErrors((prev) => ({...prev, [key]: ''}));
    };

    const validate = () => {
        const e = {};
        if (!form.title || form.title.length < 10)
            e.title = 'Title must be at least 10 characters';
        if (!form.details)
            e.details = 'Details are required';
        if (!form.location)
            e.location = 'Location is required';
        if (!form.price || Number(form.price) <= 0)
            e.price = 'Please enter a valid price';
        if (!form.propertytype)
            e.propertytype = 'Please select a property type';
        if (!form.availablefrom)
            e.availablefrom = 'Please select an available from date';
        if (images.length === 0)
            e.images = 'Please upload at least one image';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            document.querySelector('.border-red')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();

            Object.entries(form).forEach(([k, v]) => {
                formData.append(k, v);
            });

            formData.append('owner', userId);

            images.forEach((img) => {
                if (img instanceof File) {
                    formData.append('images', img);
                }
            });

            const response = await addProperty(formData);

            if (response.status === SUCCESS) {
                nav('/profile?tab=listings');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-bg w-3/4 max-w-[1280px] p-8">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-base font-bold text-accent">
                                {isEdit ? 'Edit property' : 'Add new property'}
                            </h1>
                            <p className="text-xs text-gray-500">
                                {isEdit ? 'Update your listing details' : 'Fill in the details to list your property'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {saved && (
                            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                Saved
              </span>
                        )}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving}
                            className="bg-primary hover:bg-primary disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {saving && (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                            )}
                            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Publish listing'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* ── Section 1: Photos ──────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <SectionHeader number="1" title="Photos"
                                   subtitle="Add up to 10 photos. The first photo will be your primary image."/>
                    <ImageUpload
                        label=""
                        images={images}
                        onAdd={(files) => setImages((prev) => [...prev, ...files].slice(0, 10))}
                        onRemove={(i) => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    />
                    {errors.images && <p className="mt-2 text-xs text-red">{errors.images}</p>}
                </div>

                {/* ── Section 2: Basic info ──────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                    <SectionHeader number="2" title="Basic information"
                                   subtitle="Give your listing a clear, descriptive title."/>

                    <Input
                        label="Title"
                        required
                        placeholder="e.g. Cozy 2-bed apartment near city centre, bills included"
                        value={form.title}
                        onChange={(e) => set('title', e.target.value)}
                        error={errors.title}
                        maxLength={150}
                    />
                    <div className="text-right -mt-3">
                        <span className="text-xs text-gray-400">{form.title.length}/150</span>
                    </div>

                    <div>
                        <Label required>Description</Label>
                        <textarea
                            rows={5}
                            placeholder="Describe the property — location highlights, transport links, nearby amenities..."
                            value={form.details}
                            onChange={(e) => set('details', e.target.value)}
                            maxLength={2000}
                            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-accent placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none
                ${errors.details ? 'border-red bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                        />
                        <div className="flex justify-between mt-1">
                            {errors.details
                                ? <p className="text-xs text-red">{errors.details}</p>
                                : <span/>}
                            <span className="text-xs text-gray-400">{form.details.length}/2000</span>
                        </div>
                    </div>

                    <Input
                        label="Location"
                        required
                        placeholder="e.g. Rathmines, Dublin 6"
                        value={form.location}
                        onChange={(e) => set('location', e.target.value)}
                        error={errors.location}
                    />
                </div>

                {/* ── Section 3: Property type ───────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                    <SectionHeader number="3" title="Property type"/>

                    <div className="grid grid-cols-3 gap-3">
                        {PROPERTY_TYPES.map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                onClick={() => set('propertytype', t.value)}
                                className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                                    form.propertytype === t.value
                                        ? 'border-primary bg-bg text-primary'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    {errors.propertytype && <p className="text-xs text-red">{errors.propertytype}</p>}

                    <div className="grid grid-cols-3 gap-3">
                        {RENTAL_TYPES.map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                onClick={() => set('rentaltype', t.value)}
                                className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                                    form.rentaltype === t.value
                                        ? 'border-primary bg-bg text-primary'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Section 4: Pricing ─────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                    <SectionHeader number="4" title="Pricing"/>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label required>Rent amount (€)</Label>
                            <div className="relative">
                                <span
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">€</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={form.price}
                                    onChange={(e) => set('price', e.target.value)}
                                    className={`w-full pl-7 pr-3.5 py-2.5 border rounded-lg text-sm text-accent
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all
                    ${errors.price ? 'border-red bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                                />
                            </div>
                            {errors.price && <p className="mt-1 text-xs text-red">{errors.price}</p>}
                        </div>

                        <Select
                            label="Price period"
                            value={form.pricedisplay}
                            onChange={(e) => set('pricedisplay', e.target.value)}
                        >
                            {PRICE_DISPLAY.map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* ── Section 5: Room details ────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                    <SectionHeader number="5" title="Room details"/>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Bedrooms"
                            value={form.bedrooms}
                            onChange={(e) => set('bedrooms', Number(e.target.value))}
                        >
                            {BEDROOM_OPTIONS.map((n) => (
                                <option key={n} value={n}>
                                    {n === 0 ? 'Studio (0)' : `${n} bedroom${n > 1 ? 's' : ''}`}
                                </option>
                            ))}
                        </Select>

                        <Select
                            label="Bathrooms"
                            value={form.bathrooms}
                            onChange={(e) => set('bathrooms', Number(e.target.value))}
                        >
                            {BATHROOM_OPTIONS.map((n) => (
                                <option key={n} value={n}>{n} bathroom{n > 1 ? 's' : ''}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Toggle
                            label="Private bathroom"
                            description="Tenant has exclusive use of a bathroom"
                            checked={form.isprivatebathroom}
                            onChange={(v) => set('isprivatebathroom', v)}
                        />
                        <Toggle
                            label="Shared bed"
                            description="Bedroom is shared with another person"
                            checked={form.issharedbed}
                            onChange={(v) => set('issharedbed', v)}
                        />
                    </div>
                </div>

                {/* ── Section 6: Features ────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                    <SectionHeader number="6" title="Features & inclusions"/>
                    <Toggle
                        label="Bills included"
                        description="Electricity, gas, and/or internet included in rent"
                        checked={form.billsincluded}
                        onChange={(v) => set('billsincluded', v)}
                    />
                    <Toggle
                        label="Furnished"
                        description="Property comes with furniture"
                        checked={form.furnished}
                        onChange={(v) => set('furnished', v)}
                    />
                    <Toggle
                        label="New listing"
                        description="Mark this as a newly added property"
                        checked={form.isnew}
                        onChange={(v) => set('isnew', v)}
                    />
                    <Toggle
                        label="Available"
                        description="Property is currently available to rent"
                        checked={form.available}
                        onChange={(v) => set('available', v)}
                    />
                </div>

                {/* ── Section 7: Availability & BER ─────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                    <SectionHeader number="7" title="Availability & BER rating"/>

                    <Input
                        label="Available from"
                        required
                        type="date"
                        value={form.availablefrom}
                        onChange={(e) => set('availablefrom', e.target.value)}
                        error={errors.availablefrom}
                    />

                    <Select
                        label="BER Rating"
                        value={form.berrating}
                        onChange={(e) => set('berrating', e.target.value)}
                    >
                        <option value="">— Select BER rating —</option>
                        {BER_RATINGS.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </Select>
                    <p className="text-xs text-gray-400 -mt-3">
                        BER (Building Energy Rating) is required by law for all rental properties in Ireland.
                    </p>
                </div>

                {/* ── Submit ─────────────────────────────────────────────────────── */}
                <div className="flex gap-3 pb-8">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-3 cursor-pointer bg-primary hover:bg-primary disabled:opacity-60 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {saving && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                        )}
                        {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Publish listing'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default PropertyFormPage;