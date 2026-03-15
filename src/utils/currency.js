export const formatEURO = (amount) => {
    return new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
    }).format(amount);
};