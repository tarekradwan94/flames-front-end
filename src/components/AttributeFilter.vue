<template>
    <div :class="{ 'attribute-filter-container-selected': selected || active, 'attribute-filter-container-active': active }"
            class="attribute-filter-container">
        <button @click="toggleValuesPopover" class="attribute-filter">
                {{ inputTitle }}
                <img class="filter-by-icon" :alt="$t('filterBy')" src="../assets/filter-by-icon.png">
        </button>
        <div v-if="valuesPopoverShown" class="attribute-values-popover">
            <div class="attribute-options">
                <div class="attribute-option" v-for="option in options" :key="option.key">
                    <label class="attribute-option-label">
                        {{ option.text }}
                        <input class="attribute-option-checkbox" type="checkbox" v-model="option.selected" :value="option.key">
                        <span class="attribute-option-checkmark"></span>
                    </label>
                </div>
            </div>
            <div class="attribute-values-popover-actions">
                <button @click="applyFilter" class="apply-filter-button">{{ $t('apply') }}</button>
                <button @click="resetFilter" class="reset-filter-button">{{ $t('reset') }}</button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "AttributeFilter",
    props: {
        inputTitle: String,
        options: Array
    },
    data: function () {
        return {
            selected: false,
            valuesPopoverShown: false
        }
    },
     computed: {
        selectedOptions: function () {
            return this.options.filter(function (option) {
                return option.selected
            });
        },
        active: function () {
            return this.selectedOptions.length > 0;
        }
    },
    mounted: function () {
        document.addEventListener('click', this.checkClickAway);
        document.addEventListener('touchstart', this.checkClickAway);
    },
    beforeDestroy: function () {
      document.removeEventListener('click', this.checkClickAway);
      document.removeEventListener('touchstart', this.checkClickAway);
    },
    methods: {
        toggleValuesPopover: function () {
            this.valuesPopoverShown = !this.valuesPopoverShown;
            this.selected = !this.selected;
        },
        hideValuesPopover: function () {
            this.valuesPopoverShown = false;
            this.selected = false;
        },
        checkClickAway: function (e) {   
            let attributeFilter = this.$vnode.elm;
            if(attributeFilter.getElementsByClassName("attribute-values-popover").length === 1) {
                let attributeFilterPopover = attributeFilter.getElementsByClassName("attribute-values-popover")[0];
                if (!attributeFilter.contains(e.target) && !attributeFilterPopover.contains(e.target)){
                    this.hideValuesPopover();
                }
            }
        },
        resetFilter: function () {
            for(let i = 0; i < this.options.length; i++) {
                this.options[i].selected = false;
            }
            this.applyFilter();
        },
        applyFilter: function () {
            this.hideValuesPopover();
            this.$emit("applyFilter");
        },
    }
}

</script>

<style lang="scss">

    $lineHeight: 38px;

    .attribute-filter-container {
        display: inline-block;
        position: relative;
        height: $lineHeight;
        line-height: $lineHeight;
        width: 170px;
        margin: 10px 10px 10px 0px;
        padding: 0 10px 0 10px;
        border: 1px solid #dedede;
        font-weight: 500;
        font-size: 0.9rem;
        color: #a4a4a4;

        .attribute-filter {
            width: 100%;
            background: none;
            color: inherit;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            outline: inherit;
            margin: 0;
            text-align: left;
        }

        .filter-by-icon {
            width: 12px;
            height: 12px;
            position: relative;
            float: right;
            margin: 14px 0 14px 0;
        }

        .attribute-values-popover {
            position: absolute;
            left: -1.5px;
            margin: 2px 0 0 0;
            padding: 10px 5px 5px 15px;
            width: 280px;
            z-index: 99;
            background-color: white;
            box-shadow: 2px 2px 5px #2b2b2b40;
            border: 1px solid #dedede;
        }

        .attribute-values-popover-actions {
            bottom: 0px;
            height: 44px;

            button {
                margin: 7px 5px 7px 5px;
                width: 80px;
                height: 30px;
                float: right;
                border-radius: 5px;
                vertical-align: middle;
                line-height: 30px;
                font-weight: 400;
                font-size: 0.8rem;
            }

            .apply-filter-button {
                color: white;
                background-color: #006db6;
            }

            .reset-filter-button {
                color: #006db6;
                background-color: white;
            }
        }

        .attribute-options {
            max-height: 200px;
            overflow-y: auto;
        }

        .attribute-option {
            margin-top: 5px;
        }
    }

    .attribute-filter-container-selected {
        border: 1.5px solid #006db6 !important;
    }

    .attribute-filter-container-active {
        color: #006db6 !important;
    }



    .attribute-option-label {
        display: block;
        position: relative;
        padding-left: 30px;
        cursor: pointer;
        font-size: 0.9rem;
        color: #6c6c6c;
        line-height: 20px;
        margin-bottom: 15px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Hide the browser's default checkbox */
    .attribute-option-label input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* Create a custom checkbox */
    .attribute-option-checkmark {
        position: absolute;
        left: 0;
        height: 16px;
        width: 16px;
        border-radius: 3px;
        border: 1px solid #a9a9a9;
        top: 50%;
        transform: translate(0, -50%);
    }

        /* On mouse-over, add a grey background color */
    .attribute-option-label:hover input ~ .attribute-option-checkmark {
        background-color: rgb(233, 233, 233);
    }

    /* When the checkbox is checked, add a blue background */
    .attribute-option-label input:checked ~ .attribute-option-checkmark {
        background-color: #006db6;
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .attribute-option-checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    .attribute-option-label input:checked ~ .attribute-option-checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .attribute-option-label .attribute-option-checkmark:after {
        left: 5px;
        top: 2px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }

</style>