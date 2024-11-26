export const handleExport = (jsonState: string) => {
    // Create a Blob with the JSON string
    const blob = new Blob([jsonState], {
        type: "application/json",
    });

    // Create a temporary anchor element
    const link = document.createElement("a");

    // Create an object URL for the Blob and set it as the href
    link.href = URL.createObjectURL(blob);

    // Set the download attribute to specify the file name
    link.download = "playingCardExport.json";

    // Programmatically click the link to trigger the download
    link.click();

    // Optional: Release the object URL after use
    URL.revokeObjectURL(link.href);
};
