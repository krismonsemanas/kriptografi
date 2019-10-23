$(document).ready(function() {
    // menampikan atau mengnyembunyikan form input
    $('#type').change(function() {
        if($(this).val() != ''){
            $('#form-enkrip-dekrip').addClass('displayOn');
            $('#plaintext').val('');
            $('#chipertext').val('');
            $('#key').val('');
            if($(this).val() == 'affine'){
                $('#keyAffine').addClass('displayOn')
                $('#fromKey').removeClass('displayOn')
            }else{
                $('#keyAffine').removeClass('displayOn')
                $('#fromKey').addClass('displayOn')
            }
        }else{
            $('#form-enkrip-dekrip').removeClass('displayOn')
        }
    });
    var btnEnkrip = $('#btnEnkrip');
    // kondisi tombol dengan id btnEnkrip ditekan
    btnEnkrip.click(function() {
        // inputan kosong
        if($('#plaintext').val() == '' ) {
            alert('tidak boleh kosong!')
        }else{
            if($('#type').val() == 'vigenere'){
                var plainTextVigenare = $('#plaintext').val();
                var keyVigenrer = $('#key').val().toLowerCase();
                $('#chipertext').val(crypt(plainTextVigenare,keyVigenrer,1))
            }else if($('#type').val() == 'monoalphabetik'){
                var strKey = keyMono($('#key').val().toLowerCase());
                var plain = $('#plaintext').val();
                $('#chipertext').val((doEncryptMono(plain,strKey)));
            }else{
                var plain = $('#plaintext').val();
                var a = $('#valueA').val();
                var b = $('#valueB').val();
                $('#chipertext').val(doEncryptAffine(plain,parseInt(a),parseInt(b)));
            }
        }
    });
    $('#btnDekrip').click(function() {
        if($('#chipertext').val() == '') {
            alert('tidak boleh kosong!')
        }else{
            // type dekripsi
            if($('#type').val() == 'vigenere'){
                // tampilkan hasil dekrip vigenere
                $('#plaintext').val('');
                $('#plaintext').val(crypt($('#chipertext').val(),$('#key').val().toLowerCase(),2))
            }else if($('#type').val() == 'monoalphabetik'){
                var strKey = keyMono($('#key').val().toLowerCase());
                var msg = $('#chipertext').val();
                $('#plaintext').val(doDecryptMono(msg,strKey));
            }else{
                var msg = $('#chipertext').val();
                var a = $('#valueA').val();
                var b = $('#valueB').val();
                $('#plaintext').val(doDecryptAffine(msg,parseInt(a),parseInt(b)));
            }
        }
    });
    function crypt(input,key,type) {
        var output = "";
        let keyX = [];
        let chrX = [];
        for(let i = 0,j=0;i < input.length; i++){
            var c = input.charCodeAt(i);
            // kondisi inputan huruf kecil
            if(isLowercase(c)){
                // proses enkripsi plain teks
                if(type == 1){
                    output += String.fromCharCode((c - 97 + key.charCodeAt(j % key.length) - 97 ) % 26 + 97);
                    j++;
                }else{
                    // proses dekripsi chipertexx
                    keyX[i] = key.charCodeAt(j % key.length) % 97 ;
                    chrX[i] = c % 97;
                    if(chrX[i] - keyX[i] < 0){
                        output += String.fromCharCode(26 + (chrX[i] - keyX[i]) + 97);
                    }else{
                        output += String.fromCharCode((chrX[i] - keyX[i] % 26) + 97);
                    }
                    // output += 
                    j++;
                }
            }else if (isUppercase(c)){ // kondisi huruf kapital
                if(type == 1){
                    output +=String.fromCharCode((c-65 + (key.charCodeAt(j % key.length) % 32 - 1)) % 26 + 65);
                    j++;
                }else{
                    if(c - 65 - (key.charCodeAt(j%key.length) % 32 - 1) >= 0){
                        output += String.fromCharCode(c - 65 - (key.charCodeAt(j % key.length) % 32 - 1) + 65)
                    }else{
                        output += String.fromCharCode(26 + (c-65 - (key.charCodeAt(j % key.length) % 32 - 1))+65);
                    }
                    j++;
                }
            }else{
                output += input.charAt(i);
            }
        }
        return output;
    }
    // inputan huruf besar
    function isUppercase(c) {
        return 65 <= c && c <= 90;  // karekter ascii A-Z (65-90).
    }

    // inputan huruf kecil
    function isLowercase(c) {
        return 97 <= c && c <= 122;  // 97 karakter ascii a-z (97-122).
    }
    // monoalphabet generet key function
    function keyMono(key){
        var encoded = "";
        var splitKey = key.split('');
        var arr = (function (s) { var a = []; while (s-- > 0)
            a.push(false); return a; })(26);
        for (let i = 0; i < splitKey.length; i++) {
            if (arr[(key[i].charCodeAt(0)) - 97] === false) {
                encoded += key[i];
                arr[(key[i].charCodeAt(0)) - 97] = true;
            } 
        }
		for (var i = 0; i < 26; i++) {
            {
                if (arr[i] === false) {
                    arr[i] = true;
                    encoded += String.fromCharCode((i + 97));
                }
            }
            ;
        }
		return encoded; 
    }
    // enkripsi monoalphabet
    function doEncryptMono(plain, key){
        var cipher = '';
        for (let i = 0; i < plain.length; i++) {
            if(plain[i].charCodeAt(0) >= 'a'.charCodeAt(0) && plain[i].charCodeAt(0) <= 'z'.charCodeAt(0)){
                var pos = (plain[i].charCodeAt(0)- 97);
                cipher += String.fromCharCode(key.charCodeAt(pos));
            }else if(plain[i].charCodeAt(0) >= 'A'.charCodeAt(0) && plain[i].charCodeAt(0) <= 'Z'.charCodeAt(0)){
                var pos = (plain[i].charCodeAt(0) - 65);
                cipher += String.fromCharCode(key.charCodeAt(pos) - 32);
            }else{
                cipher += String.fromCharCode(plain[i].charCodeAt(0));
            }
        }
        return cipher;
    }
    // dekripsi monoalphabet
    function doDecryptMono(cipher, key){
        var alpha = "abcdefghijklmnopqrstuvwxyz";
        var kapital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var plain = '';
        var i,j;
        for (i = 0; i < cipher.length; i++) {
            for (j = 0; j < key.length; j++) {
                if(isLowercase(cipher[i].charCodeAt(0))){
                    if(cipher.charAt(i) == key.charAt(j)){
                        plain += alpha.charAt(j);
                        break;
                    }
                }else if(isUppercase(cipher[i].charCodeAt(0))) {
                    if(cipher.charCodeAt(i) == (key.charAt(j).charCodeAt(0) - 32)){
                        plain += kapital.charAt(j);
                        break;
                    }
                }
            }
            if(j === key.length){
                plain += cipher.charAt(i)
            }
        }
        return plain;
    }
    // affine enkripsi
    function doEncryptAffine(plain,a,b) {
       var cipher = '';
       for (let i = 0; i < plain.length; i++) {
           if(plain[i].charCodeAt(0) >= 'a'.charCodeAt(0) && plain[i].charCodeAt(0) <= 'z'.charCodeAt(0)){
                cipher += String.fromCharCode((a*(plain[i].charCodeAt(0)-97) + b) % 26 + 97);
           }else if(isUppercase(plain[i].charCodeAt(0))){
               cipher += String.fromCharCode((a*(plain[i].charCodeAt(0)-65) + b) % 26 + 65);
           }else{
               cipher += String.fromCharCode(plain[i].charCodeAt(0))
           }
       }
       return cipher;
    }
    function doDecryptAffine(plain,a,b) {
        var x,c;
        for (c = 0; c < 26; c++) {
            var flag = (a * c) % 26;
            if(flag == 1 ){
                    x = c;
            } 
        }
        var cipher = '';
        for (let i = 0; i < plain.length; i++) {
            if(plain[i].charCodeAt(0) >= 'a'.charCodeAt(0) && plain[i].charCodeAt(0) <= 'z'.charCodeAt(0)){
                if(plain[i].charCodeAt(0) - 97 - b >= 0) {
                    cipher += String.fromCharCode(x * (plain[i].charCodeAt(0)-97 - b) % 26 + 97)
                }else{
                    cipher += String.fromCharCode(x * ((plain[i].charCodeAt(0) - 97) - b + 26) % 26 + 97);
                }
            }else if(isUppercase(plain[i].charCodeAt(0))){
                if(plain[i].charCodeAt(0) - 65 - b >= 0) {
                    cipher += String.fromCharCode(x * (plain[i].charCodeAt(0)-65 - b) % 26 + 65)
                }else{
                    cipher += String.fromCharCode(x * ((plain[i].charCodeAt(0) - 65) - b + 26) % 26 + 65);
                }
            }else{
                    cipher += String.fromCharCode(plain[i].charCodeAt(0))
            }
        }
       return cipher;
    }
    // count up count down
    $('#btnUpA').click(function() {
        $('#valueA').val(parseInt($('#valueA').val())+ 2)
    })
    $('#btnDownA').click(function() {
        $('#valueA').val(parseInt($('#valueA').val())- 2)
    })
    $('#btnUpB').click(function() {
        $('#valueB').val(parseInt($('#valueB').val())+ 1)
    })
    $('#btnDownB').click(function() {
        $('#valueB').val(parseInt($('#valueB').val())- 1)
    })
})