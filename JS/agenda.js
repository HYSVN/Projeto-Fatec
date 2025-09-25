document.addEventListener('DOMContentLoaded', function () {
    // Elementos da interface
    const servicoItems = document.querySelectorAll('.servico-item');
    const calendarioEl = document.getElementById('calendario');
    const horariosEl = document.getElementById('horarios');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarioMesEl = document.querySelector('.calendario-mes');
    const btnAgendar = document.getElementById('btn-agendar');

    // Elementos de resumo
    const resumoServico = document.getElementById('resumo-servico');
    const resumoData = document.getElementById('resumo-data');
    const resumoHorario = document.getElementById('resumo-horario');
    const resumoValor = document.getElementById('resumo-valor');
    const resumoTotal = document.getElementById('resumo-total');

    // Dados do agendamento
    let agendamento = {
        servico: null,
        data: null,
        horario: null,
        valor: 0
    };

    // Datas e horários indisponíveis (simulados)
    const datasIndisponiveis = ['2023-06-10', '2023-06-15', '2023-06-22'];
    const horariosIndisponiveis = {
        '2023-06-12': ['09:00', '10:00', '14:00'],
        '2023-06-13': ['11:00', '15:00'],
        '2023-06-19': ['09:00', '10:00', '16:00']
    };

    // Horários de funcionamento
    const horariosFuncionamento = [
        '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // Mês atual para o calendário
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Selecionar serviço
    servicoItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remover seleção anterior
            servicoItems.forEach(i => i.classList.remove('selecionado'));

            // Adicionar seleção atual
            this.classList.add('selecionado');

            // Atualizar agendamento
            agendamento.servico = this.dataset.servico;
            agendamento.valor = parseFloat(this.dataset.preco);

            // Atualizar resumo
            atualizarResumo();
        });
    });

    // Navegar entre meses no calendário
    prevMonthBtn.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendario();
    });

    nextMonthBtn.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendario();
    });

    // Renderizar calendário
    function renderCalendario() {
        // Atualizar título do mês
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        calendarioMesEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Limpar calendário
        calendarioEl.innerHTML = '';

        // Adicionar dias da semana
        const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        daysOfWeek.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendario-dia';
            dayEl.textContent = day;
            dayEl.style.fontWeight = 'bold';
            dayEl.style.cursor = 'default';
            calendarioEl.appendChild(dayEl);
        });

        // Obter primeiro dia do mês e quantidade de dias
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Preencher dias vazios no início
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendario-dia';
            calendarioEl.appendChild(emptyDay);
        }

        // Adicionar dias do mês
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendario-dia';
            dayEl.textContent = day;

            const date = new Date(currentYear, currentMonth, day);

            // Verificar se é hoje
            if (date.getTime() === today.getTime()) {
                dayEl.classList.add('hoje');
            }

            // Verificar se a data é passada
            if (date < today) {
                dayEl.classList.add('indisponivel');
            } else {
                // Verificar se a data está indisponível
                const dateStr = date.toISOString().split('T')[0];
                if (datasIndisponiveis.includes(dateStr)) {
                    dayEl.classList.add('indisponivel');
                } else {
                    // Adicionar evento de clique para selecionar a data
                    dayEl.addEventListener('click', function () {
                        selecionarData(date);
                    });
                }
            }

            calendarioEl.appendChild(dayEl);
        }
    }

    // Selecionar data
    function selecionarData(date) {
        agendamento.data = date;

        // Destacar data selecionada
        const allDays = document.querySelectorAll('.calendario-dia');
        allDays.forEach(day => {
            day.classList.remove('selecionado');
        });

        // Encontrar e destacar o dia clicado
        const dayNum = date.getDate();
        const days = document.querySelectorAll('.calendario-dia');
        let dayIndex = 7 + date.getDay(); // Pular os cabeçalhos dos dias da semana

        // Encontrar o elemento correto do dia (pode variar dependendo do primeiro dia do mês)
        for (let i = 7; i < days.length; i++) {
            if (parseInt(days[i].textContent) === dayNum) {
                days[i].classList.add('selecionado');
                break;
            }
        }

        // Carregar horários para a data selecionada
        carregarHorarios(date);

        // Atualizar resumo
        atualizarResumo();
    }

    // Carregar horários para uma data
    function carregarHorarios(date) {
        // Limpar horários
        horariosEl.innerHTML = '';

        const dateStr = date.toISOString().split('T')[0];
        const indisponiveis = horariosIndisponiveis[dateStr] || [];

        // Adicionar botões de horário
        horariosFuncionamento.forEach(horario => {
            const horarioBtn = document.createElement('button');
            horarioBtn.className = 'horario-btn';
            horarioBtn.textContent = horario;

            if (indisponiveis.includes(horario)) {
                horarioBtn.classList.add('indisponivel');
            } else {
                horarioBtn.addEventListener('click', function () {
                    selecionarHorario(horario);
                });
            }

            horariosEl.appendChild(horarioBtn);
        });
    }

    // Selecionar horário
    function selecionarHorario(horario) {
        agendamento.horario = horario;

        // Destacar horário selecionado
        const allHorarios = document.querySelectorAll('.horario-btn');
        allHorarios.forEach(btn => {
            btn.classList.remove('selecionado');
        });

        // Encontrar e destacar o horário clicado
        allHorarios.forEach(btn => {
            if (btn.textContent === horario && !btn.classList.contains('indisponivel')) {
                btn.classList.add('selecionado');
            }
        });

        // Atualizar resumo
        atualizarResumo();
    }

    // Atualizar resumo do agendamento
    function atualizarResumo() {
        if (agendamento.servico) {
            resumoServico.textContent = agendamento.servico;
            resumoValor.textContent = `R$ ${agendamento.valor.toFixed(2).replace('.', ',')}`;
        }

        if (agendamento.data) {
            const dataFormatada = agendamento.data.toLocaleDateString('pt-BR');
            resumoData.textContent = dataFormatada;
        }

        if (agendamento.horario) {
            resumoHorario.textContent = agendamento.horario;
        }

        resumoTotal.textContent = `R$ ${agendamento.valor.toFixed(2).replace('.', ',')}`;
    }

    // Finalizar agendamento
    btnAgendar.addEventListener('click', function () {
        // Validar dados
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;

        if (!agendamento.servico) {
            alert('Por favor, selecione um serviço.');
            return;
        }

        if (!agendamento.data) {
            alert('Por favor, selecione uma data.');
            return;
        }

        if (!agendamento.horario) {
            alert('Por favor, selecione um horário.');
            return;
        }

        if (!nome) {
            alert('Por favor, informe seu nome.');
            return;
        }

        if (!telefone) {
            alert('Por favor, informe seu telefone.');
            return;
        }

        // Simular envio do agendamento
        const dataFormatada = agendamento.data.toLocaleDateString('pt-BR');

        alert(`Agendamento realizado com sucesso!\n\nServiço: ${agendamento.servico}\nData: ${dataFormatada}\nHorário: ${agendamento.horario}\nValor: R$ ${agendamento.valor.toFixed(2).replace('.', ',')}\n\nEm breve entraremos em contato para confirmar.`);

        // Limpar formulário (opcional)
        document.querySelectorAll('.servico-item').forEach(item => {
            item.classList.remove('selecionado');
        });

        document.querySelectorAll('.calendario-dia').forEach(day => {
            day.classList.remove('selecionado');
        });

        document.querySelectorAll('.horario-btn').forEach(btn => {
            btn.classList.remove('selecionado');
        });

        document.getElementById('nome').value = '';
        document.getElementById('telefone').value = '';

        agendamento = {
            servico: null,
            data: null,
            horario: null,
            valor: 0
        };

        atualizarResumo();
    });

    // Inicializar calendário
    renderCalendario();
});
