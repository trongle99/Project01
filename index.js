function HandelClick() {
    let element = [];
    let input_value = document.getElementById("input").value;

    let isMany = input_value.includes(",");
    if (isMany) {
        element = split(input_value);
    } else {
        element.push(input_value);
    }
    // console.log(element)

    convert(element);

    document.getElementById("output").value = convert(element);
    // document.getElementById("output").value = input_value;
}

function HandelCopy() {
    let str = document.getElementById("output").value;
    copyToClipboard(str);

    let btn_copy = document.getElementById("btn-copy");
    btn_copy.innerHTML = `<span class="text-success"><i class="far fa-check-circle"></i></span> Copied`;
    setTimeout(() => { btn_copy.innerHTML = `Copy`; }, 2000);
}

function copyToClipboard(str) {
    if (navigator.clipboard.writeText) {
        navigator.clipboard.writeText(str);

        new Notify({
            status: 'success',
            title: 'Success',
            text: 'Copy success to clipboard',
            autoclose: true,
            autotimeout: 2000,
            position: 'right top'
        })
    };
}

const split = (str) => {
    let arrayStrig = str.split(",");
    let newArray = [];
    arrayStrig.map((item) => {
        newArray.push(item.trim())
    })
    return newArray;
};

const convert = (val) => {
    let content = '';
    let variable = '';
    let exchangeArray = 'public function exchangeArray($data){\n';
    let arrayCopy = 'public function getArrayCopy(){\n    return get_object_vars($this);\n}\n';
    let get_set = '';

    const valLength = val.length;
    val.map((item, i) => {
        if (valLength > i + 1) {
            variable += `protected $${item};\n`;
            exchangeArray += `    $this->${item} = (isset($data['${item}']) && $data['${item}'] != '') ? $data['${item}'] : null;\n`;
        } else {
            variable += `protected $${item};\n`;
            exchangeArray += `    $this->${item} = (isset($data['${item}']) && $data['${item}'] != '') ? $data['${item}'] : null;\n}\n`;
        }

        get_set += getterAndSetter(item);
    })

    content += variable + '\n' + exchangeArray + '\n' + arrayCopy + '\n' + get_set;

    return content;
}

const getterAndSetter = (value) => {
    let group = '';
    let get = '';
    let set = '';

    let str = snakeToCamel(value);
    get += `public function get${str}()\n{\n    return $this->${value};\n}\n`;
    set += `public function set${str}($${value})\n{\n    $this->${value} = $${value};\n}\n`

    group += get + set + '\n';
    return group;
}

const snakeToCamel = str =>
    str.charAt(0).toUpperCase() + (str.slice(1).replace(/([-_][a-z])/g, group =>
        group
            .toUpperCase()
            .replace('-', '')
            .replace('_', '')
    ));