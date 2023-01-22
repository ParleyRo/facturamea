export default {
	template: `
		
		<div class="control">
			<p class="mb-2 pl-1">Select your {{type}}</p>
			<div class="select">
				<select v-model="selected" v-on:change="changed">
					
					<option value="">Nothing selected</option>
					<option 
						v-for="companyData in companiesData"
						:key="companyData.name"
						:value="companyData.name"
					>
						{{companyData.name}}
					</option>

				</select>
			</div>

		</div>
	`,
	data() {
		
		return {
			selected: "",
		}
			
	},
	props: {
		companiesData: Object,
		select: String,
		type: String
	},
	watch: {
		select: function(value){
			this.selected=value;
			this.$emit('changed', {
				companyName: this.selected,
				type: this.type
			});
		}
	},
	methods: {
		changed: function(elem){
			this.$emit('changed', {
				companyName: this.selected,
				type: this.type
			});
		}
	}

}