const apiUrl = 'https://apb0tdhoch.execute-api.us-east-2.amazonaws.com/default/EVPP-GalleryAPI';

async function addGalleryItem(item) {
    try {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
        }
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headersList,
            body: JSON.stringify(item)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding gallery item:', error);
        throw error;
    }
}

async function getGalleryItems() {
    try {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json",
        }
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headersList
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting gallery items:', error);
        throw error;
    }
}