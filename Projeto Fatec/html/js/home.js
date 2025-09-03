// Você pode adicionar interatividade aqui
// Por exemplo, abrir links ou interagir com os ícones
const icons = document.querySelectorAll('.icon');

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        alert(`${icon.querySelector('p').textContent} clicado!`);
    });
});
