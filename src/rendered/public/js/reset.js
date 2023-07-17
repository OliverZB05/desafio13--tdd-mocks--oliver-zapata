const form = document.getElementById('resetForm');

// Agregando un evento de envío al formulario
form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    let emptyFields = 0;
    data.forEach((value, key) => {
        if (!value.trim()) emptyFields++;
        obj[key] = value.trim();
    });
    // Verificando si hay campos vacíos
    if (emptyFields > 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: `Faltan ${emptyFields} campos por rellenar`,
            showConfirmButton: false,
            timer: 3000
        });
        return;
    }

    // Enviando datos al servidor para restablecer la contraseña
    fetch('/api/sessions/reset', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => result.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.replace('/');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: data.error,
                showConfirmButton: false,
                timer: 3000
            });
        }
    })
})