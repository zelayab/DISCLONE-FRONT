
function previewAvatar() {

    var fileInput = document.getElementById('avatar');
    var previewImg = document.getElementById('avatar-preview-img');

  if (fileInput.files && fileInput.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      previewImg.setAttribute('src', e.target.result);
    };

    reader.readAsDataURL(fileInput.files[0]);
    /* si esta subida una imagen se borra el input con un display none */
    fileInput.style.display = 'none';
    previewImg.style.display = 'block';

  } else {
    previewImg.setAttribute('src', '');
  }
}

/* Edit/Update User */
function toggleEditForm() {
    var formContainer = document.querySelector(".edit-profile-form-container");
    var editbtn = document.getElementById("edit-btn");

    if (formContainer.style.display === "none") {
        formContainer.style.display = "block";
    } else {
        formContainer.style.display = "none";
    }

    if (editbtn.style.display === "none") {
        editbtn.style.display = "block";
    } else {
        editbtn.style.display = "none";
    }
}

function cancelEditForm() {
    var formContainer = document.querySelector(".edit-profile-form-container");
    var editbtn = document.getElementById("edit-btn");

    if (formContainer.style.display === "none") {
        formContainer.style.display = "block";
    } else {
        formContainer.style.display = "none";
    }

    if (editbtn.style.display === "none") {
        editbtn.style.display = "block";
    } else {
        editbtn.style.display = "none";
    }
}

function update_user() {
    const email = document.getElementsByName("email")[0].value;
    const password = document.getElementById("password").value;

    const data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    
    fetch("/profile", {
        method: "POST",
        body: data,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
            // Redirigir a la página de perfil después de un breve retraso
            setTimeout(() => {
                window.location.href = "/";
            }, 2000); // Espera 2 segundos antes de redirigir
            
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

/* MODAL FUNCTIONS */
let isModalOpen = false; // Variable para verificar si el modal ya está abierto

function openModal() {
    
    const modalContainer = document.querySelector(".modal-container");
    const modalContent = document.querySelector(".modal-content");
    const Name = document.getElementById("name")
    console.log(Name);
    const Category = document.getElementById("category")
    console.log(Category);
    const Description = document.getElementById("description")
    console.log(Description);

    if(Name == null || Category == null || Description == null){
        console.log('nulo')
        /* escondemos el submit button */
        alert("Rellenar todos los campos para crear un servidor")
    }

    if (!isModalOpen) {
        console.log("Open modal")
        isModalOpen = true;
        modalContainer.style.display = "block";

        const modalUrl = "/static/html/create_server_modal.html";
        fetch(modalUrl)
            .then((response) => response.text())
            .then((data) => {
                modalContent.innerHTML = data;
            })
            .catch((error) => {
                console.error("Error:", error);
                closeModal();
            });
    
    } else {
        closeModal();
    }
}


function closeChannelModal() {
    const modalContainer = document.getElementById("modalChannelContainer");
    if(!modalContainer){
        return;
    }else{
        modalContainer.style.display = "none";
    }
    /* para que no se cree un modal encima del otro */
    const modalContent = document.getElementById("modalChannelContent");
    modalContent.innerHTML = "";
    
    isModalOpen = false;
}

function closeModal() {
    const modalContainer = document.getElementById("modalContainer");
    if(!modalContainer){
        return;
    }else{
        modalContainer.style.display = "none";
    }
    /* para que no se cree un modal encima del otro */
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = "";

    isModalOpen = false;
}



/* SERVER FUNCTIONS */
function deleteServer() {
    // Obtener el servidor seleccionado en el menú desplegable
    const serverSelect = document.getElementById("serverSelect");
    const selectedServerId = serverSelect.value;

    console.log("Server ID:", selectedServerId)

    /* llamamos a la función del back */
    const data = new URLSearchParams();
    data.append("serverId", selectedServerId);


    /* llamamos a la función del back */
    fetch("/servers/delete_server", {
        method: "POST",
        body: data,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
            // redirigir al index refrescando
            window.location.reload();

          
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
function selectServer(serverId) {
    alert(`Seleccionaste el servidor con ID: ${serverId}`);
}

function redirectToSelectedChannel() {
    const selectedChannelId = document.getElementById("channelSelect").value;
    console.log("Selected channel ID:", selectedChannelId)
    const serverId = window.location.pathname.split("/")[2];
    window.location.href = `/servers/${serverId}/channels/${selectedChannelId}`;
}


/* MESSAGE FUNCTIONS */



function openChannelModal(serverName = "", serverId = "") {
    const modalContainer = document.querySelector(".modal-container");
    const modalContent = document.querySelector(".modal-content");
    const nameInput = document.getElementById("name");
    const categoryInput = document.getElementById("category");
    const descriptionInput = document.getElementById("description");
    // Verificar que los campos obligatorios estén completos
    if (!nameInput || !categoryInput || !descriptionInput) {
        alert("Por favor, complete todos los campos para crear un canal.");
    }
    
    if (!isModalOpen) {
        /* sacamos el id del servidor desde la URL */
        const serverId = window.location.pathname.split("/")[2];
        console.log(serverId)

        isModalOpen = true;
        modalContainer.style.display = "block";


        // Aquí puedes utilizar el nombre y el ID del servidor para personalizar el modal
        const modalHtml = `
            <h1>Crear Canal</h1>
            <h2>Nombre del servidor: ${serverName}</h2>
            <form class="form" id="form1" action="/server/create_channel" method="POST">
                <input type="hidden" name="server_id" value="${serverId}">
                <p class="Nombre">
                    <input name="name" type="text" class="validate[required,custom[onlyLetter],length[0,100]] feedback-input" placeholder="Nombre" id="name" />
                </p>
                <p class="Categoria">
                    <input name="category" type="text" class="validate[required,custom[onlyLetter],length[0,100]] feedback-input" placeholder="Categoria" id="category" />
                </p>
                <p class="text">
                    <textarea name="description" class="validate[required,length[6,300]] feedback-input" id="description" placeholder="Descripcion"></textarea>
                </p>
                <div class="flex justify-center">
                    <div class="submit w-50 m-3">
                        <input type="submit" value="SUBMIT" id="button-blue" />
                        <div class="ease"></div>
                    </div>
                    <!-- Botón para cerrar el modal -->
                    <button class="w-50 m-3" onclick="closeChannelModal()">Cerrar</button>
                </div>
            </form>
        `;

        modalContent.innerHTML = modalHtml;
    } else {
        closeChannelModal();
    }
}

function redirectToSelectedChannel() {
    const channelSelect = document.getElementById("channelSelect");
    const selectedChannelId = channelSelect.value;
    const messageList = document.getElementById("message-list");

    if (selectedChannelId) {
        console.log("Selected channel ID:", selectedChannelId);

        // Hacer una solicitud fetch para obtener los mensajes del canal seleccionado
        fetch(`/get_messages?channel_id=${selectedChannelId}`)
            .then((response) => {
                console.log("Respuesta de la solicitud fetch:", response)
                if (!response.ok) {
                    throw new Error(`Error en la solicitud fetch: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {

                // Limpiamos el contenido actual de messageList
                messageList.innerHTML = "";

                // Si no hay mensajes, mostramos un mensaje y el formulario de envío
                if (data.length === 0) {
                    const li = document.createElement("li");
                    li.classList.add("message-list-empty");
                    li.textContent = "No hay mensajes en este canal";
                    messageList.appendChild(li);
                } else {
                    // Si hay mensajes, los mostramos
                    data.forEach((message) => {
                        const li = document.createElement("li");
                        const div = document.createElement("div");
                        // creamos un index para que cada mensaje tenga un id diferente
                        div.classList.add("flex", "flex-column", "mb-2");
                        div.innerHTML = `
                            <div class="flex justify-between">
                                <p class="message--author">${message.author}</p>
                                <div class="message-date">${message.created_at}</div>
                            </div>
                            <div class="flex">
                                <p class="message--content" id="content">${message.content}</p>
                            </div>
                            <div class="message-options" >
                                <button class="edit-button btn btn-primary" data-message-id="${message.id} " onclick="editMessage('${message.id}')">Editar</button>
                                <button class="delete-button btn btn-primary" data-message-id="${message.id}" onclick="deleteMessage('${message.id}')">Eliminar</button>
                            </div>
                        `;

                        li.appendChild(div);
                        messageList.appendChild(li);
                    });
                }
                // Agregamos el formulario para enviar mensajes
                const form = document.createElement("form");
                form.method = "POST";
                form.action = `/servers/${serverId.value}/channels/${selectedChannelId}/messages`; // Reemplaza server.id dinámicamente
                form.innerHTML = `
                    <div class="message-input-container">
                        <form class="w-100">
                            <input
                                class="message--input"
                                type="text"
                                name="content"
                                placeholder="Escribe un mensaje..."
                                required
                            />
                            <button class="btn btn-primary" type="submit">Enviar</button>
                        </form>
                    </div>
                `;
                messageList.appendChild(form);

                // Botón de envío para actualizar el mensaje
                const editButtons = document.querySelectorAll(".edit-button");
                const deleteButtons = document.querySelectorAll(".delete-button");
                const modalContainer = document.querySelector(".modal-container");




                editButtons.forEach((editButton) => {
                    editButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        modalContainer.style.display = "block";
                        const messageId = editButton.dataset.messageId;
                        // para buscar el contenido del mensaje vamos a buscar el padre del padre del botón
                        const content = editButton.parentNode.parentNode.querySelector("#content").textContent;
                        
                        console.log("Edit button clicked for Message ID:", messageId);
                        console.log("Edit button clicked for Message content:", content);

                       // llamo a la función que crea el modal
                           openEditModal(messageId, content);                       
                    });
                });

                deleteButtons.forEach((deleteButton) => {
                    deleteButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        const messageId = deleteButton.dataset.messageId;
                        console.log("Delete button clicked for Message ID:", messageId);

                        deleteMessage(messageId);
                    });
                });
            })
            .catch((error) => {
                console.error("Error al obtener mensajes:", error);
            });
    } else {
        // No se ha seleccionado ningún canal, puedes manejarlo como desees
        console.log("No se ha seleccionado ningún canal");
    }
}



// Resto de tu código JavaScript existente

function deleteMessage(messageId) {
    const channelSelect = document.getElementById("channelSelect");
    const selectedChannelId = channelSelect.value;
    const serverId = parseInt(window.location.pathname.split("/")[2]); // Parsear como número entero
    console.log("Selected channel ID:", selectedChannelId);
    console.log("Server ID:", serverId);

    // Verifica que los IDs sean válidos antes de hacer la solicitud DELETE
    if (selectedChannelId && messageId) {
        console.log('entro y el id es: ', messageId);
        // Realizar la solicitud DELETE al servidor apuntando a la ruta correcta
        fetch(`/servers/${serverId}/channels/${selectedChannelId}/messages/${messageId}`, {
            method: "DELETE",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Mensaje eliminado exitosamente") {
                console.log("Mensaje eliminado exitosamente");
                window.location.reload(); // Recargar la página
            } else {
                console.error("Error:", data);
                // Manejar el caso de error según tus necesidades
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    } else {
        console.error("IDs inválidos");
    }
}




function openEditModal(messageId, content) {
    const modalContainer = document.querySelector(".modal-container");
    const modalContent = document.querySelector(".modal-content");
    const messageInput = document.getElementById("message-input");
    const messageForm = document.getElementById("message-form");
    const messageList = document.getElementById("message-list");
    const serverId = parseInt(window.location.pathname.split("/")[2]); // Parsear como número entero
    const channelSelect = document.getElementById("channelSelect");
    const selectedChannelId = channelSelect.value;

    if (!isModalOpen) {
        isModalOpen = true;
        modalContainer.style.display = "block";

        const modalHtml = `
            <h1>Editar Mensaje</h1>
            <form class="form" id="form1">
                <input type="hidden" name="messageId" value="${messageId}">
                <p class="text">
                    <textarea name="content" class="validate[required,length[6,300]] feedback-input" id="message-input" placeholder="Mensaje">${content}</textarea>
                </p>
                <div class="flex justify-center">
                    <div class="submit w-50 m-3">
                        <input type="submit" value="SUBMIT" id="button-blue" />
                        <div class="ease"></div>
                    </div>
                    <!-- Botón para cerrar el modal -->
                    <button class="w-50 m-3" onclick="closeModal()">Cerrar</button>
                </div>
            </form>
        `;
        modalContent.innerHTML = modalHtml;

        // Agregar el evento submit al formulario
        const form = document.getElementById("form1");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Formulario enviado");
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            console.log("Form data:", data);

            // Realizar la solicitud PUT al servidor apuntando a la ruta correcta
            fetch(`/servers/${serverId}/channels/${selectedChannelId}/messages/${messageId}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                        console.log("Mensaje actualizado exitosamente");
                        window.location.reload(); // Recargar la página
                    }
                )
                .catch((error) => {
                    console.error("Error:", error);
                });
        });

    } else {
        closeModal();
    }
}


setTimeout(function() {
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(function(message) {
        message.style.display = 'none';
    });
}, 10000);

setTimeout(function() {
    var alertMessage = document.getElementById('alert-message');
    if (alertMessage) {
        alertMessage.style.display = 'none';
    }
}, 5000); // Ocultar después de 5 segundos (5000 milisegundos)









