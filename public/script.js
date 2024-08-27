document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.item-row');
    rows.forEach(row => {
        row.addEventListener('click', (event) => {
            const index = event.currentTarget.querySelector('.plus').getAttribute('data-index');
            const detailsRows = document.querySelectorAll(`.details-row[data-parent-index="${index}"]`);

            detailsRows.forEach(detailsRow => {
                if (detailsRow.style.display === 'none') {
                    detailsRow.style.display = 'table-row'; 
                    event.currentTarget.querySelector('.plus').textContent = '-'; 
                } else {
                    detailsRow.style.display = 'none'; 
                    event.currentTarget.querySelector('.plus').textContent = '+'; 
                }
            });
        });
    });

    const detailsRows = document.querySelectorAll('.details-row');
    detailsRows.forEach(row => {
        row.addEventListener('click', (event) => {
            const index = event.currentTarget.querySelector('.pluss').getAttribute('data-index');
            const moreDetailsRows = document.querySelectorAll(`.more-details-row[more-parent-index="${index}"]`);

            moreDetailsRows.forEach(moreDetailsRow => {
                if (moreDetailsRow.style.display === 'none') {
                    moreDetailsRow.style.display = 'table-row';
                    event.currentTarget.querySelector('.pluss').textContent = '--'; 
                } else {
                    moreDetailsRow.style.display = 'none';
                    event.currentTarget.querySelector('.pluss').textContent = '++'; 
                }
            });
        });
    });
});