$(document).ready(function () {
    // Inicializa el DataTable para tasksTable
    $('#tasksTable').DataTable({
        "paging": true,
        "searching": true,
        "info": true,
        "autoWidth": false
    });

    // Maneja el clic en el botón "Nueva Meta"
    $('#newMetaBtn').on('click', function () {
        $('#metaModal').modal('show');
    });

    // Maneja el clic en el botón "Guardar Meta"
    $('#saveMetaBtn').on('click', function () {
        var metaName = $('#metaName').val();
        if (metaName) {
            // Aquí puedes manejar la lógica para guardar la nueva meta
            console.log('Nueva meta guardada:', metaName);
            $('#metaModal').modal('hide');
        } else {
            alert('Por favor, ingrese el nombre de la meta.');
        }
    });

    // Maneja el clic en el botón "Nueva Tarea"
    $('#newTaskBtn').on('click', function () {
        $('#taskModal').modal('show');
    });

    // Maneja el clic en el botón "Guardar Tarea"
    $('#saveTaskBtn').on('click', function () {
        var taskName = $('#taskName').val();
        var taskDate = $('#taskDate').val();
        var taskStatus = $('#taskStatus').val();

        if (taskName && taskDate && taskStatus) {
            // Aquí puedes manejar la lógica para guardar la nueva tarea
            console.log('Nueva tarea guardada:', taskName, taskDate, taskStatus);
            $('#taskModal').modal('hide');
        } else {
            alert('Por favor, complete todos los campos de la tarea.');
        }
    });
});
