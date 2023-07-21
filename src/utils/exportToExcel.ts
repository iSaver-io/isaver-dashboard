import XLSX from 'xlsx';

export const exportToExcel = (filename: string, data: any[], headers?: string[]) => {
  /* generate worksheet and workbook */
  const worksheet = XLSX.utils.aoa_to_sheet([], {});
  /* fix headers */
  if (headers) {
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
  }
  XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 'A2' });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);

  /* calculate column width */
  //   const columns = data[0] && Object.keys(data[0]).length;

  //   data.reduce((widths, row) => {
  //     Object.entries;
  //   }, []);

  //   for (let i = 0; i < columns; i++) {
  //     const maxWidth = data.reduce((w, r) => Math.max(w, r.name.length), 10);
  //     worksheet['!cols'] = [{ wch: max_width }];
  //   }

  const currentDate = new Date().toISOString().split('T')[0];

  /* create an XLSX file and try to save to Presidents.xlsx */
  XLSX.writeFile(workbook, `${filename}_${currentDate}.xlsx`, { compression: true });
};
