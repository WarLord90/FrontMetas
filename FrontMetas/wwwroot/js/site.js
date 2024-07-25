$(document).ready(function () {
    // Inicializa el DataTable para tasksTable
    $('#tblTareas').DataTable({
        "paging": true,
        "searching": true,
        "info": true,
        "autoWidth": false
    });

    // Muestra el modal de metas
    $('#btnNvaMeta').on('click', function () {
        $('#mdlMeta').modal('show');
    });

    // Maneja el clic en el botón "Guardar Meta"
    $('#btnRegistraMeta').on('click', function () {
        var metaNombre = $('#txtMetaNombre').val();
        if (metaNombre) {
            // Aquí puedes manejar la lógica para guardar la nueva meta
            console.log('Nueva meta guardada:', metaNombre);
            $('#mdlMeta').modal('hide');
        } else {
            alert('Por favor, ingrese el nombre de la meta.');
        }
    });

    // Muestra el modal de tareas
    $('#btnNvaTarea').on('click', function () {
        $('#mdlTarea').modal('show');
    });

    // Maneja el clic en el botón "Guardar Tarea"
    $('#btnRegistraTarea').on('click', function () {
        var tareaNombre = $('#txtTareaNombre').val();

        if (tareaNombre) {
            // Aquí puedes manejar la lógica para guardar la nueva tarea
            console.log('Nueva tarea guardada:', tareaNombre);
            $('#mdlTarea').modal('hide');
        } else {
            alert('Por favor, complete todos los campos de la tarea.');
        }
    });
});
