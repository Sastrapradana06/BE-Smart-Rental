function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const date = new Date(dateString);
  const day = date.getDate(); // Tanggal
  const month = months[date.getMonth()]; // Bulan dalam format singkat
  const year = date.getFullYear(); // Tahun

  return `${day} ${month}, ${year}`;
}

module.exports = { formatDate };
