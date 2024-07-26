var urlAPI = 'https://localhost:7159/api/';
$(document).ready(function () {
    // Inicializa el DataTable para tasksTable
    $('#tblTareas').DataTable({
        "paging": true,
        "searching": true,
        "info": true,
        "autoWidth": false
    });

    $('#tblTareas tbody').empty();
    // Muestra el modal de metas
    $('#btnNvaMeta').on('click', function () {
        $('#txtMetaNombre').val('');
        $('#btnRegistraMeta').show();
        $('#btnEditaMeta').hide();
        $('#btnEliminaMeta').hide();
        $('#mdlMeta').modal('show');
    });

    // Maneja el clic en el botón "Guardar Meta"
    $('#btnRegistraMeta').on('click', function () {
        var metaNombre = $('#txtMetaNombre').val();
        $('#txtMetaNombre').prop('disabled', false);
        if (metaNombre) {
            var metaData = {
                NombreMeta: metaNombre,
                IdEstatus: 1,
                Activo: true,
                FechaRegistro: new Date().toISOString()
            };

            $.ajax({
                url: urlAPI + 'Metas',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(metaData),
                success: function (response) {
                    console.log('Nueva meta guardada:', response);
                    $('#mdlMeta').modal('hide');
                    obtenerMetas();
                    // Actualiza la tabla de metas o realiza otras acciones necesarias
                },
                error: function (xhr, status, error) {
                    alert('Error al guardar la meta: ' + xhr.responseText);
                }
            });
        } else {
            alert('Por favor, ingrese el nombre de la meta.');
        }
    });

    $('#btnEditaMeta').on('click', function () {
        var idMeta = $(this).data('id'); 
        var nuevoNombre = $('#txtMetaNombre').val();
        $('#txtMetaNombre').prop('disabled', true);

        actualizarMeta(idMeta, nuevoNombre);
    });

    $('#btnEliminaMeta').on('click', function () {
        var idMeta = $(this).data('id');
        var nuevoNombre = $('#txtMetaNombre').val();

        eliminarMeta(idMeta);        
    });

    // Muestra el modal de tareas
    $('#btnNvaTarea').on('click', function () {
        $('#txtTareaNombre').val('');
        $('#selectMeta').val('0');
        $('#mdlTarea').modal('show');
    });

    // Maneja el clic en el botón "Guardar Tarea"
    $('#btnRegistraTarea').on('click', function () {
        var TareaNombre = $('#txtTareaNombre').val();
        var idMeta = $('#selectMeta').val();
        $('#mdlMeta .modal-title').text('Registrar Meta');
        

        if (TareaNombre) {
            var tareaData = {
                NombreTarea: TareaNombre,
                IdEstatus: 1,
                Activo: true,
                FechaRegistro: new Date().toISOString(),
                IdMeta: idMeta
            };

            $.ajax({
                url: urlAPI + 'Tareas',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(tareaData),
                success: function (response) {
                    console.log('Nueva tarea guardada:', response);
                    $('#mdlTarea').modal('hide');
                    obtenerTareas(idMeta);
                    // Actualiza la tabla de tareas o realiza otras acciones necesarias
                },
                error: function (xhr, status, error) {
                    alert('Error al guardar la tarea: ' + xhr.responseText);
                }
            });
        } else {
            alert('Por favor, complete todos los campos de la tarea.');
        }
    });

    obtenerMetas();
});

function obtenerMetas() {
    $.ajax({
        url: urlAPI + 'Metas',
        type: 'GET',
        success: function (response) {
            // Limpiar la tabla antes de agregar las nuevas filas
            $('#metasTable tbody').empty();

            // Iterar sobre las metas y agregarlas a la tabla
            response.forEach(function (meta) {
                var progressValue = calcularProgreso(meta); // Asumiendo que tienes una función para calcular el progreso
                var nuevaFila = `
                    <tr>
                        <td>${meta.nombreMeta}</td>
                        <td>
                            <button class="btn btn-sm btn-info" data-id="${meta.idMeta}" onclick="ObtenerMetaDetalle(${meta.idMeta},1)" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" data-id="${meta.idMeta}" onclick="ObtenerMetaDetalle(${meta.idMeta},2)" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button class="btn btn-sm btn-primary" data-id="${meta.idMeta}" onclick="obtenerTareas(${meta.idMeta})" data-bs-toggle="tooltip" data-bs-placement="top" title="Detallar">
                                <i class="bi bi-list"></i>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div class="progress mt-2" style="height: 1.5rem;">
                                <div class="progress-bar" role="progressbar" style="width: ${progressValue}%;" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100">${progressValue}%</div>
                            </div>
                        </td>
                    </tr>
                `;
                $('#metasTable tbody').append(nuevaFila);
            });

            // Inicializar los tooltips
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener las metas:', error);
        }
    });
}

// Función para obtener una meta por ID y mostrar los datos en el modal
function ObtenerMetaDetalle(idMeta,tipo) {
    $.ajax({
        url: urlAPI + 'Metas/' + idMeta, // URL correcta para el endpoint
        type: 'GET',
        success: function (response) {
            // Asumiendo que la respuesta es un array con un solo objeto
            var meta = response[0];

            // Rellenar el campo de texto con el nombre de la meta
            $('#txtMetaNombre').val(meta.nombreMeta);            

            if (tipo == 1) {
                $('#txtMetaNombre').prop('disabled', false);
                $('#mdlMeta .modal-title').text('Editar Meta');
                $('#btnRegistraMeta').hide();
                $('#btnEditaMeta').show().attr('data-id', idMeta);
                $('#btnEliminaMeta').hide();

            } else if (tipo == 2) {
                $('#txtMetaNombre').prop('disabled', true);
                $('#mdlMeta .modal-title').text('Eliminar Meta');
                $('#btnRegistraMeta').hide();                
                $('#btnEditaMeta').hide();
                $('#btnEliminaMeta').show().attr('data-id', idMeta);
            }

            // Mostrar el modal
            $('#mdlMeta').modal('show');
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener la meta:', error);
        }
    });
}

function actualizarMeta(idMeta, nuevoNombre) {
    $.ajax({
        url: urlAPI + 'Metas/' + idMeta, // URL del endpoint para actualizar la meta
        type: 'PUT',
        contentType: 'application/json', // Asegúrate de enviar el contenido como JSON
        data: JSON.stringify({
            IdMeta: idMeta,
            NombreMeta: nuevoNombre,
            FechaActualizacion: new Date().toISOString()
        }),
        success: function (response) {
            console.log(response.message); // Mensaje de éxito
            // Cierra el modal
            $('#mdlMeta').modal('hide');
            obtenerMetas();
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar la meta:', error);
        }
    });
}

function eliminarMeta(idMeta) {
    
    $.ajax({
        url: urlAPI + 'Metas/' + idMeta, // URL correcta para el endpoint DELETE
        type: 'DELETE',
        success: function (response) {
            console.log(response.messaje); // Mensaje de éxito
            // Actualiza la tabla de metas después de eliminar la meta
            $('#mdlMeta').modal('hide');
            obtenerMetas();
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar la meta:', error);
        }
    });    
}


function calcularProgreso(meta) {
    // Implementa la lógica para calcular el progreso de la meta
    // Por ejemplo, si tienes un campo para el progreso en la meta, puedes usarlo aquí
    return meta.progress || 0; // Retorna 0 si no hay campo de progreso
}

function obtenerTareas(metaId) {
    $.ajax({
        url: urlAPI + 'Metas/Tareas/' + metaId, // URL correcta para el endpoint
        type: 'GET',
        success: function (response) {
            // Limpiar la tabla de tareas antes de agregar las nuevas filas
            $('#tblTareas tbody').empty();

            // Verificar si la respuesta contiene datos
            if (response.length > 0) {
                // Iterar sobre las tareas y agregarlas a la tabla
                response.forEach(function (tarea) {
                    console.log(tarea);
                    var nuevaFila = `
                        <tr>
                            <td>${tarea.nombreTarea}</td>
                            <td>${new Date(tarea.fechaRegistro).toLocaleDateString()}</td>
                            <td>${tarea.estatusNombre}</td>
                            <td>
                                <button class="btn btn-sm btn-info me-2">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    $('#tblTareas tbody').append(nuevaFila);
                });
            } else {
                // Mostrar un mensaje en caso de que no haya tareas
                $('#tblTareas tbody').append(`
                    <tr>
                        <td colspan="4" class="text-center">No hay tareas para esta meta.</td>
                    </tr>
                `);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener las tareas:', error);
            // Limpiar la tabla en caso de error
            $('#tblTareas tbody').empty().append(`
                <tr>
                    <td colspan="4" class="text-center">Error al cargar las tareas.</td>
                </tr>
            `);
        }
    });
}


function cargarMetasEnDropdown() {
    $.ajax({
        url: urlAPI + 'Metas', // URL del endpoint para obtener las metas
        type: 'GET',
        success: function (response) {
            var selectMeta = $('#selectMeta');
            selectMeta.empty(); // Limpiar el dropdown antes de agregar nuevas opciones
            selectMeta.append('<option value="">Seleccione una meta</option>'); // Opción por defecto

            // Iterar sobre las metas y agregar cada una como opción en el dropdown
            response.forEach(function (meta) {
                selectMeta.append(
                    `<option value="${meta.idMeta}">${meta.nombreMeta}</option>`
                );
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al cargar las metas:', error);
        }
    });
}

// Llamar a la función para cargar las metas cuando se abre el modal
$('#mdlTarea').on('shown.bs.modal', function () {
    cargarMetasEnDropdown();
});




