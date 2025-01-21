document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('dark-mode-toggle');
  toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      document.querySelector('header').classList.toggle('dark-mode');
      document.querySelector('footer').classList.toggle('dark-mode');
      document.querySelectorAll('nav ul li a').forEach(element => {
          element.classList.toggle('dark-mode');
      });
      document.querySelector('.dark-mode-button i').classList.toggle('fa-moon');
      document.querySelector('.dark-mode-button i').classList.toggle('fa-sun');
  });
});
