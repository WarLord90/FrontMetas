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
        var metaNombre = $('#txtMetaNombre').val().trim();
        $('#txtMetaNombre').prop('disabled', false);

        // Validar si el campo no está vacío
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
                    cargarMetasEnDropdown();
                },
                error: function (xhr, status, error) {
                    alert('Error al guardar la meta: ' + xhr.responseText);
                }
            });
        } else {
            alert('Por favor, ingrese el nombre de la meta.');
        }
    });


    // Función para actualizar la meta
    $('#btnEditaMeta').on('click', function () {
        var idMeta = $(this).data('id');
        var nuevoNombre = $('#txtMetaNombre').val().trim();

        // Validar que el campo no esté vacío
        if (nuevoNombre === '') {
            alert('El nombre de la meta no puede estar vacío.');
            return;
        }

        // Llamar a la función para actualizar la meta
        actualizarMeta(idMeta, nuevoNombre);
    });

    // Función para eliminar la meta
    $('#btnEliminaMeta').on('click', function () {
        var idMeta = $(this).data('id');
        var nuevoNombre = $('#txtMetaNombre').val().trim();

        // Validar que el campo no esté vacío
        if (nuevoNombre === '') {
            alert('El nombre de la meta no puede estar vacío.');
            return;
        }

        // Deshabilitar el campo de texto
        $('#txtMetaNombre').prop('disabled', true);

        // Llamar a la función para eliminar la meta
        eliminarMeta(idMeta);
    });


    // Muestra el modal de tareas
    $('#btnNvaTarea').on('click', function () {
        $('#txtTareaNombre').val('');
        $('#selectMeta').val('0');
        $('#btnRegistraTarea').show();
        $('#btnEditaTarea').hide();
        $('#btnEliminaTarea').hide();
        $('#mdlTarea').modal('show');
    });

    // Maneja el clic en el botón "Guardar Tarea"
    $('#btnRegistraTarea').on('click', function () {
        var tareaNombre = $('#txtTareaNombre').val().trim();
        var idMeta = $('#selectMeta').val();

        if (tareaNombre && idMeta !== '0') {
            var tareaData = {
                NombreTarea: tareaNombre,
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
                },
                error: function (xhr, status, error) {
                    alert('Error al guardar la tarea: ' + xhr.responseText);
                }
            });
        } else {
            alert('Por favor, complete todos los campos de la tarea.');
        }
    });


    // Función para actualizar la tarea
    $('#btnEditaTarea').on('click', function () {
        var idTarea = $(this).data('id');
        var nuevoNombre = $('#txtTareaNombre').val().trim();
        var idMeta = $('#selectMeta').val();

        if (nuevoNombre === '') {
            alert('El nombre de la tarea no puede estar vacío.');
            return;
        }
        if (idMeta === '0') {
            alert('Debe seleccionar una meta.');
            return;
        }

        // Llamar a la función para actualizar la tarea
        actualizarTarea(idTarea, nuevoNombre, idMeta);
    });

    // Función para eliminar la tarea
    $('#btnEliminaTarea').on('click', function () {
        var idTarea = $(this).data('id');
        var nuevoNombre = $('#txtTareaNombre').val().trim();
        var idMeta = $('#selectMeta').val();

        if (nuevoNombre === '') {
            alert('El nombre de la tarea no puede estar vacío.');
            return;
        }
        if (idMeta === '0') {
            alert('Debe seleccionar una meta.');
            return;
        }

        // Deshabilitar los campos de texto y selección
        $('#txtTareaNombre').prop('disabled', true);
        $('#selectMeta').prop('disabled', true);

        // Llamar a la función para eliminar la tarea
        eliminarTarea(idTarea, idMeta);
    });

    cargarMetasEnDropdown();
    obtenerMetas();
});

function obtenerMetas() {
    $.ajax({
        url: urlAPI + 'Metas',
        type: 'GET',
        success: function (response) {
            $('#metasTable tbody').empty();

            // Iterar sobre las metas y agregarlas a la tabla
            response.forEach(function (meta) {
                var progressValue = calcularProgreso(meta);
                var nuevaFila = `
                    <tr>
                        <td>${meta.nombreMeta}</td>
                        <td>
                            <button class="btn btn-sm btn-info" data-id="${meta.idMeta}" onclick="obtenerMetaDetalle(${meta.idMeta},1)" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" data-id="${meta.idMeta}" onclick="obtenerMetaDetalle(${meta.idMeta},2)" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar">
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

            $('[data-bs-toggle="tooltip"]').tooltip('dispose');
            $('[data-bs-toggle="tooltip"]').tooltip();
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener las metas:', error);
        }
    });
}



// Función para obtener una meta por ID y mostrar los datos en el modal
function obtenerMetaDetalle(idMeta,tipo) {
    $.ajax({
        url: urlAPI + 'Metas/' + idMeta,
        type: 'GET',
        success: function (response) {
            var meta = response[0];
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
            $('#mdlMeta').modal('show');
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener la meta:', error);
        }
    });
}

function actualizarMeta(idMeta, nuevoNombre) {
    $.ajax({
        url: urlAPI + 'Metas/' + idMeta,
        type: 'PUT',
        contentType: 'application/json',
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
            cargarMetasEnDropdown();
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar la meta:', error);
        }
    });
}

function eliminarMeta(idMeta) {
    
    $.ajax({
        url: urlAPI + 'Metas/' + idMeta,
        type: 'DELETE',
        success: function (response) {
            // Actualiza la tabla de metas después de eliminar la meta
            $('#mdlMeta').modal('hide');
            obtenerMetas();
            cargarMetasEnDropdown();
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar la meta:', error);
        }
    });    
}


function calcularProgreso(meta) {
    try {
        // Obtener las tareas asociadas a la meta
        var tareas = await obtenerTareas(metaId);

        if (tareas.length === 0) {
            return 0; // No hay tareas, progreso es 0%
        }

        var totalTareas = tareas.length;
        var tareasCompletadas = tareas.filter(t => t.estatusId === 2).length; // Tareas con estatus 2 (completadas)

        var progreso = (tareasCompletadas / totalTareas) * 100;

        return Math.round(progreso); // Retornar el progreso redondeado
    } catch (error) {
        console.error('Error al calcular el progreso:', error);
        return 0; // En caso de error, retornar 0%
    }
}

function obtenerTareas(metaId) {
    $.ajax({
        url: urlAPI + 'Metas/Tareas/' + metaId,
        type: 'GET',
        success: function (response) {
            // Limpiar la tabla de tareas antes de agregar las nuevas filas
            $('#tblTareas tbody').empty();

            // Verificar si la respuesta contiene datos
            if (response.length > 0) {
                // Iterar sobre las tareas y agregarlas a la tabla
                response.forEach(function (tarea) {
                    console.log(tarea);

                    // Verificar el estatus para desactivar botones si es igual a 2
                    var botonesDesactivados = tarea.estatusId === 2;

                    var nuevaFila = `
                        <tr>
                            <td>${tarea.nombreTarea}</td>
                            <td>${new Date(tarea.fechaRegistro).toLocaleDateString()}</td>
                            <td>${tarea.estatusNombre}</td>
                            <td>
                                <button class="btn btn-sm btn-info me-2" 
                                        ${botonesDesactivados ? 'disabled' : ''} 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="top" 
                                        data-id="${tarea.idTarea}" onclick="obtenerTareaDetalle(${tarea.idTarea},1)"
                                        title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-danger me-2" 
                                        ${botonesDesactivados ? 'disabled' : ''} 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="top" 
                                        data-id="${tarea.idTarea}" onclick="obtenerTareaDetalle(${tarea.idTarea},2)"
                                        title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </button>
                                <button class="btn btn-sm btn-success" 
                                        ${botonesDesactivados ? 'disabled' : ''} 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="top" 
                                        data-id="${tarea.idTarea}" onclick="actualizaEstatus(${tarea.idTarea},${tarea.idMeta})"
                                        title="Finalizar">
                                    <i class="bi bi-check-circle"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    $('#tblTareas tbody').append(nuevaFila);
                });

                // Inicializar tooltips
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
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
        url: urlAPI + 'Metas', 
        type: 'GET',
        success: function (response) {
            var selectMeta = $('#selectMeta');
            selectMeta.empty(); 
            selectMeta.append('<option value="0">Seleccione una meta</option>'); 
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


// Función para obtener una tarea por ID y mostrar los datos en el modal
function obtenerTareaDetalle(idTarea, tipo) {
    $.ajax({
        url: urlAPI + 'Tareas/' + idTarea,
        type: 'GET',
        success: function (response) {
            var tarea = response[0];
            console.log(tarea.idMeta);

            $('#txtTareaNombre').val(tarea.nombreTarea);
            $('#selectMeta').val(tarea.idMeta);            

            if (tipo == 1) { // Editar
                $('#txtTareaNombre').prop('disabled', false);
                $('#selectMeta').prop('disabled', false);
                $('#mdlTarea .modal-title').text('Editar Tarea');
                $('#btnRegistraTarea').hide();
                $('#btnEditaTarea').show().attr('data-id', idTarea);
                $('#btnEliminaTarea').hide();
            } else if (tipo == 2) { // Eliminar
                $('#txtTareaNombre').prop('disabled', true);
                $('#selectMeta').prop('disabled', true);
                $('#mdlTarea .modal-title').text('Eliminar Tarea');
                $('#btnRegistraTarea').hide();
                $('#btnEditaTarea').hide();
                $('#btnEliminaTarea').show().attr('data-id', idTarea);
            }

            // Mostrar el modal
            $('#mdlTarea').modal('show');
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener la tarea:', error);
        }
    });
}

function actualizarTarea(idTarea, nuevoNombre,idMeta) {
    $.ajax({
        url: urlAPI + 'Tareas/' + idTareas, 
        type: 'PUT',
        contentType: 'application/json', 
        data: JSON.stringify({
            idTareas: idTarea,
            NombreMeta: nuevoNombre,
            idMeta: idMeta,
            FechaActualizacion: new Date().toISOString()
        }),
        success: function (response) {            
            $('#mdlTarea').modal('hide');
            obtenerTareas(idMeta);
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar la meta:', error);
        }
    });
}

function eliminarTarea(idTarea, idMeta) {

    $.ajax({
        url: urlAPI + 'Tareas/' + idTarea,
        type: 'DELETE',
        success: function (response) {
            console.log(response.messaje);
            // Actualiza la tabla de metas después de eliminar la tarea
            $('#mdlTarea').modal('hide');
            obtenerTareas(idMeta);
        },
        error: function (xhr, status, error) {
            console.error('Error al eliminar la tarea:', error);
        }
    });
}

function actualizaEstatus(idTarea, idMeta) {
    $.ajax({
        url: urlAPI + 'Tareas/ActualizarEstatus/' + idTarea,
        type: 'PUT',
        success: function (response) {
            console.log('Estatus actualizado:', response);
            obtenerTareas(idMeta);
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar el estatus:', error);
        }
    });
}



