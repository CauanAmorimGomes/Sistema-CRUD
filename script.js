// script.js
document.addEventListener('DOMContentLoaded', () => {
    const crudForm = document.getElementById('crudForm');
    const itemIdInput = document.getElementById('itemId');
    const itemNameInput = document.getElementById('itemName');
    const itemDescriptionInput = document.getElementById('itemDescription');
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    const itemTableBody = document.getElementById('itemTableBody');
    const searchInput = document.getElementById('searchInput');
    const noItemsMessage = document.getElementById('noItemsMessage');

    let items = [];
    let editingItemId = null; // Armazena o ID do item que está sendo editado

    // Carregar itens do localStorage
    function loadItemsFromLocalStorage() {
        const storedItems = localStorage.getItem('crudItems');
        if (storedItems) {
            items = JSON.parse(storedItems);
        }
    }

    // Salvar itens no localStorage
    function saveItemsToLocalStorage() {
        localStorage.setItem('crudItems', JSON.stringify(items));
    }

    // Renderizar itens na tabela
    function renderItems(itemsToRender = items) {
        itemTableBody.innerHTML = ''; // Limpa a tabela

        if (itemsToRender.length === 0) {
            noItemsMessage.classList.remove('hidden');
            itemTableBody.classList.add('hidden');
        } else {
            noItemsMessage.classList.add('hidden');
            itemTableBody.classList.remove('hidden');
            itemsToRender.forEach(item => {
                const row = itemTableBody.insertRow();
                row.insertCell().textContent = item.id;
                row.cells[0].setAttribute('data-label', 'ID');

                row.insertCell().textContent = item.name;
                row.cells[1].setAttribute('data-label', 'Nome');

                row.insertCell().textContent = item.description;
                row.cells[2].setAttribute('data-label', 'Descrição');

                const actionsCell = row.insertCell();
                actionsCell.setAttribute('data-label', 'Ações');
                actionsCell.classList.add('action-buttons');

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.classList.add('edit-btn');
                editButton.addEventListener('click', () => startEditItem(item.id));
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.classList.add('delete-btn');
                deleteButton.addEventListener('click', () => deleteItem(item.id));
                actionsCell.appendChild(deleteButton);
            });
        }
    }

    // Limpar formulário e resetar estado de edição
    function resetForm() {
        crudForm.reset();
        itemIdInput.value = '';
        editingItemId = null;
        saveButton.textContent = 'Salvar';
        itemNameInput.focus();
    }

    // Lógica do Formulário (Criar/Atualizar)
    crudForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = itemNameInput.value.trim();
        const description = itemDescriptionInput.value.trim();

        if (!name || !description) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (editingItemId) {
            // Atualizar item existente
            const itemIndex = items.findIndex(item => item.id === editingItemId);
            if (itemIndex > -1) {
                items[itemIndex].name = name;
                items[itemIndex].description = description;
            }
        } else {
            // Criar novo item
            const newItem = {
                id: Date.now(), // ID simples baseado no timestamp
                name: name,
                description: description
            };
            items.push(newItem);
        }

        saveItemsToLocalStorage();
        renderItems();
        resetForm();
    });

    // Iniciar edição de um item
    function startEditItem(id) {
        const item = items.find(item => item.id === id);
        if (item) {
            editingItemId = item.id;
            itemIdInput.value = item.id; // Apenas para referência, não é editável
            itemNameInput.value = item.name;
            itemDescriptionInput.value = item.description;
            saveButton.textContent = 'Atualizar';
            window.scrollTo(0, 0); // Rola para o topo para ver o formulário
            itemNameInput.focus();
        }
    }

    // Excluir item
    function deleteItem(id) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            items = items.filter(item => item.id !== id);
            saveItemsToLocalStorage();
            renderItems();
            if (editingItemId === id) { // Se o item excluído estava sendo editado
                resetForm();
            }
        }
    }

    // Botão Limpar
    clearButton.addEventListener('click', resetForm);

    // Funcionalidade de Busca
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            String(item.id).includes(searchTerm)
        );
        renderItems(filteredItems);
    });

    // Inicialização
    loadItemsFromLocalStorage();
    renderItems();
    itemNameInput.focus();
});