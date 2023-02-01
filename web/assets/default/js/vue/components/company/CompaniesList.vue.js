export default {
	template: `
		<div class="field">
  			<label class="label">Select your {{company.label}}</label>
			<div class="control">
				<div class="select is-fullwidth">
					<select v-model="company.selected" >
						
						<option value="">Nothing selected</option>
						<option 
							v-for="companyItem in company.list"
							:key="companyItem.id"
							:value="companyItem.id"
						>
							{{companyItem.name}}
						</option>

					</select>
				</div>
			</div>
		</div>
	`,
	data() {
		
		return {
			company: this.companyData,
			selected: ''
		}
			
	},
	props: {
		companyData: Object,
	}

}