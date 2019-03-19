new_techskills_component = {
    delimiters: ["{", "}"],
    components: {
		'vue-accordion': accordion_component,
		"vue-techskills-list": techskills_list,
		"vue-processed-skill": processed_tech_skill,
		"vue-processed-skills-list-header": processed_skills_list_header,
		'vue-dismiss-button': update_popup_dismiss_button,
		'vue-add-to-profile-button': update_popup_add_to_profile_button,
    },
	template: /*html*/ `	
		<div id="tSkills" class="tech-skill-block" v-if="hasSkills">
			<!--Header in case of user didn't touch any education instance-->
			<div class="form-group, last" v-if="!isAddedOrDismissedSkills">
				<div class="input-title">
					<span class="title">System Recognized Technical Skills</span>
					<span class="new-label">
						(<span class="counter">{ allEditableSkills.length } new</span>)
					</span>
					<i class="icon icon-angle-down"></i>
					<span class="sub-title">
						Choose th skills you want to add to your profile. Specify years of experience and when you used it last.
					</span>
				</div>
			</div>
			<!-- If user change status of at list one education we show accordeon-->
			<vue-accordion v-if="isAddedOrDismissedSkills" :parametr_for_body_height="[lengthOfAllAddedSkills, lengthOfAllDismissedSkills]">
				<!--with another header-->
				<div slot="header" :class="['form-group', 'last', { 'active':showAccordeonContent }]">
					<div @click.prevent="showAccordeonContent = !showAccordeonContent"
						class="input-title has-data vue-component">
						<span class="title">System Recognized Technical Skills</span>
						<span class="new-label">
							(
								<span v-if="lengthOfAllAddedSkills > 0" class="counter">{ lengthOfAllAddedSkills } new</span>
								<span v-if="lengthOfAllDismissedSkills > 0" class="counter">{ lengthOfAllDismissedSkills } dismissed</span>
							)
						</span>
						<i class="icon icon-angle-down"></i>
					</div>
				</div>
				<div class="accordion-content active">
					<div id="added-list" class="added-list" v-show="lengthOfAllAddedSkills > 0">
						<span class="title">
							<i class="icon icon-checked"></i>
							<span>Added to profile</span>
							<vue-processed-skills-list-header :columns="columnsOfAddedSkils"></vue-processed-skills-list-header>
							<ul class="tech-skills-list">
								<vue-processed-skill 
									v-for="(skill, index) in addedTechSkills" 
									:key="skill.name"
									:ts="skill" 
									:iteration="index"
									@return_skill="returnAddedTechSkill">
								</vue-processed-skill>
							</ul>
						</span>
					</div>
					<div id="dismissed-list" class="dismissed-list" v-show="lengthOfAllDismissedSkills > 0">
						<span class="title">
							<i class="icon icon-close-round"></i>
							<span>Dismissed</span>
							<vue-processed-skills-list-header :columns="columnsOfDismissedSkils">
							</vue-processed-skills-list-header>
							<ul class="tech-skills-list">
								<vue-processed-skill 
									v-for="(skill, index) in dismissedTechSkills" 
									:key="skill.name"
									:ts="skill" 
									:iteration="index"
									@return_skill="returnDismissedSkill">
								</vue-processed-skill>
							</ul>
						</span>
					</div>
				</div>
			</vue-accordion>
			<vue-techskills-list
				:isFullTopSkills="isFullTopSkills"
				:countOfAllTopSkills="countOfAllTopSkills"
				v-show="allEditableSkills.length > 0">
			</vue-techskills-list>
			<div class="align-right collapsed" v-show="allEditableSkills.length > 0">
				<vue-add-to-profile-button
					@click_button="addAllSkills">
				</vue-add-to-profile-button>
				<vue-dismiss-button
					@click_button="dismissAllSkills">
				</vue-dismiss-button>
			</div>
		</div>
	`,
    data: function() {
      return {
		showAccordeonContent: false,
      };
	},
	mounted() {},
	watch: {
		isAddedOrDismissedSkills(trigger) {
			if (!trigger) this.showAccordeonContent = false;
		},
	},
    computed: {
		...Vuex.mapGetters('techskills_store', {
			getAllTopskills: 'get_all_topskills',
			dismissedTechSkills: 'get_dismissed_techskills',
			addedTechSkills: 'get_added_techskills',
			addedTopSkills: 'get_top_in_added_skills_cv',
			editableTechSkills: 'get_editable_techskills_cv',
			editableTopSkills: 'get_top_in_editable_skills_cv',
		}),
		// Add exist skills on profile with added new top skills
		// with already marked but not added yet top skills
		countOfAllTopSkills() {
			return this.editableTopSkills.length + this.getAllTopskills.length + this.addedTopSkills.length
		},
		isFullTopSkills() {
			return this.countOfAllTopSkills == 10 ? true : false;
		},
		lengthOfAllAddedSkills() {
			return this.addedTechSkills.length;
		},
		lengthOfAllDismissedSkills() {
			return this.dismissedTechSkills.length;
		},
		// If we have added or dismissed skills accordeon becomes active
		isAddedOrDismissedSkills() {
			return this.addedTechSkills.length + this.dismissedTechSkills.length > 0 ? true : false;
		},
		allEditableSkills() {
			return this.editableTechSkills;
		},
		// If we have one added skill we have one column
		// otherwise we have two columns
		columnsOfAddedSkils() {
			return this.lengthOfAllAddedSkills == 1 ? 1 : 2;
		},
		columnsOfDismissedSkils() {
			return this.dismissedTechSkills.length == 1 ? 1 : 2;
		},
		hasSkills() {
			if(this.allEditableSkills.length || this.isAddedOrDismissedSkills) {
				return true;
			} else {
				return false;
			}
		}
    },
    methods: {
		...Vuex.mapMutations("techskills_store", [
			"SET_EDITABLE_TECHSKILLS_CV",
			"SET_EDITABLE_TOPSKILLS_CV",
			"SET_ADDED_TECHSKILLS",
		]),
		...Vuex.mapActions("techskills_store", [
			"ADD_ALL_SKILLS_TO_ADDED",
			"DISMISS_ALL_SKILLS",
			"RETURN_ADDED_TOP_SKILL",
			"RETURN_ADDED_TECH_SKILL",
			"RETURN_DISMISSED_SKILL",
		]),
		addAllSkills() {
			this.ADD_ALL_SKILLS_TO_ADDED();
		},
		dismissAllSkills() {
			this.DISMISS_ALL_SKILLS();
		},
		returnAddedTechSkill(index) {
			this.RETURN_ADDED_TECH_SKILL(index)
		},
		returnDismissedSkill(index) {
			this.RETURN_DISMISSED_SKILL(index);
		},
    },
    store
}