export const formatDate = (dateInput) => {
    if (!dateInput) return null;

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(date);
};

export const formatJoinDate = (iso) => new Date(iso).toLocaleDateString('en-IE', {year: 'numeric', month: 'long'});