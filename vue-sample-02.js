const profile_popup_helper = {
    delimiters: ['{', '}'],
    props: {
        tips: String,
        store: String,
    },
    template: /*html*/`
        <div class="helper active">
            <div class="arrow-card">
                <div class="row top-xs paddless-row">
                    <div class="col-xs-12 col-lg-2 align-center icon-cover">
                        <i class="icon icon-show-off-your-skills"></i>
                    </div>
                    <div class="col-xs-12 col-lg-10">
                        <div class="h5-title">
                            <slot>
                                Important tips for this Section
                            </slot>
                        </div>
                        <div class="paragraph" v-html="tips">
                        </div>
                    </div>
                </div>
                <button type="button" 
                        class="btn btn-grey btn-round close-helper"
                        @click="togglePopupHelper">
                    <i class="icon icon-close"></i>
                </button>
            </div>
        </div>
    `,
    methods: {
        togglePopupHelper() {
            this.$emit('close_helper');
        }
    },
}

const profile_popup = {
    delimiters: ['{', '}'],
    props: {
        id: {
            type: String,
            default: '',
        },
        show_close_button: {
            type: Boolean,
            default: true,
        },
        show_helper_button: {
            type: Boolean,
            default: false,
		},
		show_helper_initialy: {
			type: Boolean,
			default: false,
		},
        helper_tips: {
            type: String,
            default: '',
        },
        helper_name: {
            type: String,
            default: 'How this section helps You',
        },
        close_with_ESC: {
            type: Boolean,
            default: true,
        }
    },
    components: {
        'vue-popup-helper': profile_popup_helper,
    },
    template: /*html*/`
        <div :id="id" class="vue-popup skills-popup with-helper simple-popup" @click.self="misclick">
            <div class="inner" @click="close_popup_helper">
                <button v-if="show_close_button"
                        class="vue-close-popup" 
                        type="button"
                        @click="close_popup">
                    <i class="icon icon-close"></i>
                </button>
                <div class="header">
                    <div class="title">
                        <slot name="title">

                        </slot>
                    </div>
    
                    <button v-if="show_helper_button"
                            class="mobile-helper ignore-closing-helper" 
                            type="button"
                            @click="toggle_popup_helper">
                        <i class="icon icon-show-off-your-skills"></i>
                    </button>
    
                    <button v-if="show_helper_button"
                            class="btn btn-grey btn-xs btn-round helper-toggle ignore-closing-helper" 
                            type="button"
                            @click="toggle_popup_helper">
                        <i class="icon icon-info"></i>
                        <span class="fade"></span>
                    </button>
                </div>
                <div class="content">
                    <form class="simple-form modal-form">
                        <slot name="body">

                        </slot>
                        <slot name="footer">

                        </slot>
                    </form>
                </div>
                
                <!-- helper -->
                <vue-popup-helper
                    @close_helper="toggle_popup_helper"
                    v-if="isOpenHelper"
                    :tips="helper_tips">
                        {  helper_name }
                </vue-popup-helper>
            </div>
        </div>
    `,
    mounted() {
		if (this.close_with_ESC) document.addEventListener('keyup', this.closePopupESC);
	},
	created() {
		if(this.show_helper_initialy) this.toggle_popup_helper();
	},
    beforeDestroy() {
        if (this.close_with_ESC) document.removeEventListener('keyup', this.closePopupESC);
    },
    data() {
        return {
            isOpenHelper: false,
        }
    },
    methods: {
        close_popup() {
            this.$emit('close_popup');
        },
        misclick() {
            this.$emit('misclick');
        },
        closePopupESC(event) {
            if (event.keyCode === 27) {
                this.$emit('close_popup');
            } 
        },
        toggle_popup_helper() {
            this.isOpenHelper = !this.isOpenHelper;
        },
        close_popup_helper(event) {
            let element = event.target;
            if (!element.classList.contains('ignore-closing-helper') && !getParents(element, '.helper')) {
                this.isOpenHelper = false;
            }
        },
    },