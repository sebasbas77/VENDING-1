let data = [];

function addData() {
    const formData = new FormData(document.getElementById('data-form'));
    const rowData = {};
    formData.forEach((value, key) => {
        rowData[key] = value;
    });

    data.push(rowData);
    updateTable();
}

function updateTable() {
    const tbody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    data.forEach((row) => {
        const tr = document.createElement('tr');
        Object.values(row).forEach((cellData) => {
            const td = document.createElement('td');
            td.textContent = cellData;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function generateExcel() {
    const filename = document.getElementById('filename').value;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    // Apply styles to the worksheet
    const ws = workbook.Sheets["FORMATO MANTENIMIENTO"];
    const range = XLSX.utils.decode_range(ws['!ref']);

    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = { c: C, r: R };
            const cell_ref = XLSX.utils.encode_cell(cell_address);

            if (!ws[cell_ref]) continue;

            ws[cell_ref].s = {
                font: {
                    name: 'Arial',
                    sz: 10
                },
                border: {
                    top: { style: "thin", color: { auto: 1 } },
                    right: { style: "thin", color: { auto: 1 } },
                    bottom: { style: "thin", color: { auto: 1 } },
                    left: { style: "thin", color: { auto: 1 } }
                }
            };

            if (R === 0) {
                ws[cell_ref].s.fill = {
                    fgColor: { rgb: "D3D3D3" } // Light gray background for headers
                };
            }
        }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "FORMATO MANTENIMIENTO");
    XLSX.writeFile(workbook, filename);
}
