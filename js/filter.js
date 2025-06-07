String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function getForm() {
    return document.getElementById('filter-form');
}

var filter = {
    priceFrom: {
        check: function (device) {
            return parseInt(device.price.min) > parseInt(this.value);
        },
        getHtml: function () {
            return '<label for=\"priceFrom\">Цена от</label>' +
                '<input type="number" min=\"0\" id=\"priceFrom\" value=\"{0}\"/>'.format(this.value);
        },
        reset: function () {
            this.value = 0;
        }
    },
    priceTo: {
        check: function (device) {
            return parseInt(device.price.min) <= parseInt(this.value);
        },
        getHtml: function () {
            return '<label for=\"priceTo\">до</label>' +
                '<input type="number" min=\"0\" id=\"priceTo\" value=\"{0}\"/>'.format(this.value > 0 ? this.value : '');
        },
        reset: function () {
            this.value = -1;
        }
    },
    ratingFrom: {
        check: function (device) {
            return device.rating >= parseInt(this.value);
        },
        getHtml: function () {
            var resultingHtml = '';
            resultingHtml += '<label for=\"ratingFrom\">Рейтинг от</label><select id="ratingFrom">';
            for (var i = 1; i < 6; i++) {
                resultingHtml += '<option value = \"{0}\" {1}>{0}</option>'.format(i,
                    parseInt(this.value) == i ? "selected" : "");
            }
            resultingHtml += '</select>';
            return resultingHtml;
        },
        reset: function () {
            this.value = 1;
        }
    },
    m_torchlight: {
        check: function (device) {
            return !((!device.techInfo.m_torchlight || device.techInfo.m_torchlight.value == 'no') && this.value);
        },
        getHtml: function () {
            var resultingHtml = '';
            var checked = this.value ? 'checked' : '';
            resultingHtml +=
                '<div class = \"checkLine\"><input type=\"checkbox\" id=\"m_torchlight\" {0}>Фонарик</div>'.format(checked);
            return resultingHtml;
        },
        update: function (input) {
            this.value = input.checked;
        }
    },
    dual_sim: {
        check: function (device) {
            return !((!device.techInfo.dual_sim || device.techInfo.dual_sim.value == 'no') && this.value);
        },
        getHtml: function () {
            var resultingHtml = '';
            var checked = this.value ? 'checked' : '';
            resultingHtml +=
                '<div class = \"checkLine\"><input type=\"checkbox\" id=\"dual_sim\" {0}>Две sim-карты</div>'.format(checked);
            return resultingHtml;
        },
        update: function (input) {
            this.value = input.checked;
        }
    },
    dict: {
        check: function (device) {
            return !((!device.techInfo.dict || device.techInfo.dict.value == 'no') && this.value);
        },
        getHtml: function () {
            var resultingHtml = '';
            var checked = this.value ? 'checked' : '';
            resultingHtml +=
                '<div class = \"checkLine\"><input type=\"checkbox\" id=\"dict\" {0}>Диктофон</div>'.format(checked);
            return resultingHtml;
        },
        update: function (input) {
            this.value = input.checked;
        }
    },
    stylus_input: {
        check: function (device) {
            return !((!device.techInfo.stylus_input || device.techInfo.stylus_input.value == 'no') && this.value);
        },
        getHtml: function () {
            var resultingHtml = '';
            var checked = this.value ? 'checked' : '';
            resultingHtml +=
                '<div class = \"checkLine\"><input type=\"checkbox\" id=\"stylus_input\" {0}>Поддержка ввода пером</div>'.format(checked);
            return resultingHtml;
        },
        update: function (input) {
            this.value = input.checked;
        }
    },
    intern_flash: {
        check: function (device) {
            return !((!device.techInfo.intern_flash || device.techInfo.intern_flash.value == 'no') && this.value);
        },
        getHtml: function () {
            var resultingHtml = '';
            var checked = this.value ? 'checked' : '';
            resultingHtml +=
                '<div class = \"checkLine\"><input type=\"checkbox\" id=\"intern_flash\" {0}>Встроенная вспышка</div>'.format(checked);
            return resultingHtml;
        },
        update: function (input) {
            this.value = input.checked;
        }
    },
    cam_type: {
        check: function (device) {
            return this.value == 'any' || device.techInfo.cam_type.value == this.value;
        },
        getHtml: function () {
            var resultingHtml = '<div>';
            resultingHtml += '<label for=\"cam_type\">Тип камеры</label><select id="cam_type">';
            for (var i = 0; i < this.types.length; i++) {
                var type = this.types[i];
                resultingHtml += '<option value = \"{0}\" {1}>{2}</option>'.format(type.val,
                    this.value == type.val ? "selected" : "", type.text);
            }
            resultingHtml += '</select></div>';
            return resultingHtml;
        },
        types: [
            {
                val: 'any',
                text: 'Любая'
            },
            {
                val: 'зеркальная камера',
                text: 'Зеркальая'
            },
            {
                val: 'беззеркальная камера',
                text: 'Беззеркальная'
            },
            {
                val: 'компакт-камера',
                text: 'Компакт'
            }
        ]
    },
    tvtuner: {
        check: function (device) {
            return !((!device.techInfo.tvtuner || device.techInfo.tvtuner.value == 'no') && this.value);
        },
        getHtml: function () {
            var resultingHtml = '';
            var checked = this.value ? 'checked' : '';
            resultingHtml +=
                '<div class = \"checkLine\"><input type=\"checkbox\" id=\"tvtuner\" {0}>ТВ-тюнер</div>'.format(checked);
            return resultingHtml;
        },
        update: function (input) {
            this.value = input.checked;
        }
    },
    updateFilter: function () {
        var inputs = getForm();
        for (var i = 0; i < inputs.length - 1; i++) {
            var propertyName = inputs[i].getAttribute('id');
            var rule = filter[propertyName];
            if (rule.update) {
                rule.update(inputs[i]);
            } else {
                rule.value = inputs[i].value;
            }
        }
        updateCatalog(currentCategory, 1);
        redirect('{0}/1'.format(currentCategory));
        filter.saveToStorage();
    },
    updateForm: function () {
        var form = getForm();
        var resultingHtml = '';
        for (var i = 0; i < filter.rules.length; i++) {
            resultingHtml += filter[filter.rules[i]].getHtml();
        }
        resultingHtml += '<input type = \"submit\" id = \"update-filter\" value="Подобрать"/>';
        form.innerHTML = resultingHtml;
        document.getElementById("update-filter").onclick = filter.onSubmit;
        //getForm().onSubmit = filter.onSubmit;
    },
    onSubmit: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        filter.updateFilter();
    },
    checkDevice: function (device) {
        if (parseInt(device.price.min) < parseInt(filter.priceFrom)) return false;
        for (var i = 0; i < filter.rules.length; i++) {
            var filterField = filter[filter.rules[i]];
            if (!filterField.value || filterField.value == '') continue;
            if (!filter[filter.rules[i]].check(device)) return false;
        }
        return true;
    },
    retainSatisfying: function (devices, category) {
        filter.setRules(devices[0]);
        var result = [];
        var j = 0, i;
        for (i = 0; i < devices.length; i++) {
            if (filter.checkDevice(devices[i])) {
                result[j] = devices[i];
                result[j].index = i;
                result[j].category = category;
                j++;
            }
        }
        return result;
    },
    setRules: function (device) {
        this.rules = ['priceFrom', 'priceTo', 'ratingFrom'];
        var i = 3;
        for (var propertyName in filter) {
            if (device.techInfo[propertyName]) {
                this.rules[i] = propertyName;
                i++;
            }
        }
        this.updateForm();
    },
    storageName: 'amarketFilter',
    saveToStorage: function () {
        localStorage.setItem(filter.storageName, JSON.stringify(filter));
    },
    loadFromStorage: function () {
        var taken = JSON.parse(localStorage.getItem(filter.storageName));
        if (taken) {
            for (var propertyName in taken) {
                var val = taken[propertyName].value;
                if (val) filter[propertyName].value = val;
            }
        }
    }
}

filter.loadFromStorage();
