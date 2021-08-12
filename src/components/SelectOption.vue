<template>
    <div :class="{ 'select-container-selected': selected}"
            class="select-container">
        <button @click="toggleValuesPopover" class="select">
                {{ title }}
                <img class="select-icon" :alt="$t('selection')" src="../assets/select-icon.png">
        </button>
        <div v-if="valuesPopoverShown" class="select-values-popover">
            <div :class="{'select-option-selected': option.selected}"
                class="select-option" v-for="option in options" :key="option.key">
                <button class="select-option-label" @click="selectOption(option)">
                    {{ option.text }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "SelectOption",
    props: {
        name: String,
        inputTitle: String,
        options: Array
    },
    data: function () {
        return {
            valuesPopoverShown: false,
            title: this.inputTitle
        }
    },
    watch: {
        options: function() {
            this.title = this.inputTitle;
        }
    },
    computed: {
        selected: function () {
            return this.options.filter(function(option) {
                return option.selected;
            }).length > 0;
        },
        selectedOption: function () {
            if(this.selected) {
                return this.options.filter(function(option) {
                    return option.selected;
                })[0]; //assume only one item can be selected
            } else {
                return undefined;
            }
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
        },
        hideValuesPopover: function () {
            this.valuesPopoverShown = false;
        },
        checkClickAway: function (e) {   
            let selectOption = this.$vnode.elm;
            if(selectOption.getElementsByClassName("select-values-popover").length === 1) {
                let selectOptionPopover = selectOption.getElementsByClassName("select-values-popover")[0];
                if (!selectOption.contains(e.target) && !selectOptionPopover.contains(e.target)){
                    this.hideValuesPopover();
                }
            }
        },
        selectOption: function (option) {
            this.unselectAllOptions();
            option.selected = true;
            this.title = option.text;
            this.hideValuesPopover();
        },
        unselectAllOptions: function () {
            for (let i = 0; i < this.options.length; i++) {
                this.options[i].selected = false;
            }
        }
    }
}

</script>

<style lang="scss">

    $lineHeight: 38px;

    .select-container {
        display: inline-block;
        position: relative;
        height: $lineHeight;
        line-height: $lineHeight;
        width: calc(100% - (10px + 10px + 2px)); /* padding and border */
        padding: 0 10px 0 10px;
        border: 1px solid #006db6;
        font-weight: 500;
        font-size: 0.9rem;
        color: #a4a4a4;

        .select {
            width: 100%;
            text-align: left;
        }

        .select-icon {
            width: 12px;
            height: 12px;
            position: relative;
            float: right;
            margin: 14px 0 14px 0;
        }

        .select-values-popover {
            position: absolute;
            left: -1.5px;
            margin: 2px 0 0 0;
            padding: 10px 0 10px 0;
            width: 100%;
            z-index: 99;
            background-color: white;
            box-shadow: 2px 2px 5px #2b2b2b40;
            border: 1px solid #dedede;
        }

        .select-option {
            height: $lineHeight;
        }
    }

    .select-container-selected {
        color: #006db6 !important;
    }

    .select-option-label {
        display: block;
        position: relative;
        padding-left: 20px;
        cursor: pointer;
        font-size: 0.9rem;
        color: #6c6c6c;
        line-height: 100%;
        height: 100%;
        width: 100%;
        top: 50%;
        transform: translate(0, -50%);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        text-align: left;
    }

    /* On mouse-over, add a grey background color */
    .select-option:hover {
        background-color: rgb(233, 233, 233);
    }

    /* When the option is selected, add a blue background */
    .select-option-selected {
        background-color: #006db6;
    }

    .select-option-selected button {
        color: white;
    }

</style>