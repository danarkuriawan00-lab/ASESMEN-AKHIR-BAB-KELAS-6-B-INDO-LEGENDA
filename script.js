const form = document.querySelector('form');
const result = document.getElementById('result');
const submitButton = form.querySelector('.submit-button');
const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycbzollMSa2VHK0_iZKwJsk0lznyQiruawbYPy9KZSFjjxN4eu_ge6NC59641p2p9TAqRTw/exec';

const matchingChoices = [
  'A. Sumbu X',
  'B. Kalimat fakta',
  'C. Legenda',
  'D. Kata hubung (bahwa, agar)',
  'E. Legenda kegaiban',
  'F. Kalimat opini',
  'G. Tanda petik dua (“...”)',
  'H. Legenda perseorangan',
  'I. Judul grafik',
  'J. Grafik lingkaran'
];

form.querySelectorAll('select[name^="jodoh"]').forEach((select) => {
  matchingChoices.forEach((choice, index) => {
    const option = document.createElement('option');
    option.value = String.fromCharCode(65 + index);
    option.textContent = choice;
    select.append(option);
  });
});

const correctAnswers = {
  pg1: 'B', pg2: 'B', pg3: 'A', pg4: 'B', pg5: 'B',
  pg6: 'B', pg7: 'C', pg8: 'C', pg9: 'B', pg10: 'A',
  pg11: 'B', pg12: 'B', pg13: 'D', pg14: 'C', pg15: 'C',
  bs1: 'B', bs2: 'S', bs3: 'B', bs4: 'S', bs5: 'B',
  bs6: 'B', bs7: 'S', bs8: 'B', bs9: 'B', bs10: 'B',
  jodoh1: 'C', jodoh2: 'E', jodoh3: 'H', jodoh4: 'B', jodoh5: 'F',
  jodoh6: 'G', jodoh7: 'D', jodoh8: 'J', jodoh9: 'A', jodoh10: 'I'
};

const pointValues = {
  ...Object.fromEntries(Array.from({ length: 15 }, (_, i) => [`pg${i + 1}`, 2])),
  ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`bs${i + 1}`, 3])),
  ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`jodoh${i + 1}`, 4]))
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  result.hidden = false;
  result.textContent = 'Menghitung nilai dan mengirim jawaban...';

  let score = 0;
  let correctCount = 0;
  let answered = 0;
  const answers = {};

  for (const [name, correctAnswer] of Object.entries(correctAnswers)) {
    const response = form.elements[name].value;
    answers[name] = response;
    if (response) answered++;
    if (response === correctAnswer) {
      score += pointValues[name];
      correctCount++;
    }
  }

  const total = Object.keys(correctAnswers).length;
  const payload = {
    waktuKirim: new Date().toISOString(),
    nama: form.elements.nama.value,
    kelas: form.elements.kelas.value,
    tanggalLahir: form.elements['tanggal-lahir'].value,
    mataPelajaran: form.elements['mata-pelajaran'].value,
    bab: form.elements.bab.value,
    jawaban: answers,
    nilai: score,
    jawabanBenar: correctCount,
    totalSoal: total,
    jawabanTerisi: answered
  };

  try {
    await fetch(spreadsheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    result.textContent = `Tes selesai! Nilai: ${score} dari 100. Jawaban benar: ${correctCount} dari ${total}. Jawaban terisi: ${answered} dari ${total}. Permintaan penyimpanan telah dikirim ke spreadsheet.`;
    form.querySelectorAll('input, select, button').forEach((control) => {
      control.disabled = true;
    });
  } catch (error) {
    result.textContent = `Nilai: ${score} dari 100. Pengiriman ke spreadsheet gagal. Periksa koneksi internet lalu coba kumpulkan kembali.`;
    submitButton.disabled = false;
  }
});
