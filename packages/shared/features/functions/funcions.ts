export function formatDate (isoString: string){ return(
    new Date(isoString).toLocaleDateString("fi-FI", { day: "numeric", month: "long" }))}