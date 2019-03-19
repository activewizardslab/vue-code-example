let processed_tech_skill = {
    delimiters: ['{', '}'],
    props: {
        ts: {
            type: Object,
            required: true,
		},
    },
	template: /*html*/`
		<li>
			<div class="tech-item">
				<span class="name">{ ts.name }</span>
				<span class="years" :class="{'transparent': !ts.experience}">{ ts.experience } { ts.experience == 1 ? 'year' : 'years' }</span>
				<span class="last-used">{ ts.used_year }</span>
				<i v-if="isTop" class="icon icon-star grey-star"></i>
				<i v-else class="icon icon-star"></i>
				<button class="return_btn" @click.prevent="returnSkill">
					<i class="icon icon-return"></i>
				</button>
			</div>
		</li>
    `,
    data: function() {
        return {
			index: this.ts.index,
        }
	},
	computed:{
		isTop() {
			return this.ts.is_top;
		}
	},
    methods: {
		returnSkill () {
            this.$emit('return_skill', this.ts.index);
        },
    }
};