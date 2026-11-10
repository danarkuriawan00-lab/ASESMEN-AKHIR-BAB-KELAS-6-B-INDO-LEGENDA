function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Jawaban')
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Jawaban');

    const answerNames = Array.from({ length: 15 }, (_, i) => `pg${i + 1}`)
      .concat(Array.from({ length: 10 }, (_, i) => `bs${i + 1}`))
      .concat(Array.from({ length: 10 }, (_, i) => `jodoh${i + 1}`));
    const headers = [
      'Waktu Kirim', 'Nama', 'Kelas', 'Tanggal Lahir', 'Mata Pelajaran', 'Bab',
      ...answerNames,
      'Nilai', 'Jawaban Benar', 'Total Soal', 'Jawaban Terisi'
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    const answers = data.jawaban || {};
    const row = [
      data.waktuKirim || new Date().toISOString(),
      data.nama || '',
      data.kelas || '',
      data.tanggalLahir || '',
      data.mataPelajaran || '',
      data.bab || '',
      ...answerNames.map((name) => answers[name] || ''),
      data.nilai ?? '',
      data.jawabanBenar ?? '',
      data.totalSoal ?? '',
      data.jawabanTerisi ?? ''
    ];

    sheet.appendRow(row);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Jawaban berhasil disimpan.' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
