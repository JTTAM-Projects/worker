  export function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  export function formatTime(isoString: string){
    const time = new Date(isoString);
    return time.toLocaleTimeString("fi-FI", {
      hour: 'numeric',
      minute: 'numeric'
    });
  }