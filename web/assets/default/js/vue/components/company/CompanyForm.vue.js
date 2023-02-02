export default {
	template: `
		<form 
			method="post"
			:action="formAction"
			@submit.prevent="checkForm"
			
		>
			<div class="columns is-multiline is-mobile is-align-items-end">

				<div v-for="(fieldName, index) in company.fields" :key="index" class="column is-half">

					<div class="field">
						<label class="mb-2">{{formatCamelCaseToText(fieldName)}}</label>
						<div class="control is-small pt-1">
							<input 
								:id="fieldName"
								class="input is-small" 
								type="text" 
								:placeholder="formatCamelCaseToText(fieldName) + ' ...'"
								v-model="formData[fieldName]"
							>
						</div>
					</div>

				</div>
			
			</div>
			
			<div class="columns">
				<div class="column">
					<div class="control">
						<button class="button is-orange pl-6 pr-6">Submit</button>
					</div>
				</div>
			</div>
			
		</form>
	`,
	data() {

		const formData = {}
		for (const [index,fieldName] of Object.entries(this.companyData.fields)) {
			formData[fieldName] = ''
		}

		return {
			errors: {},
			formData: formData,
			company: this.companyData,
		}
			
	},
	props: {
		companyData: Object
	},
	watch: { 
		companyData: {
			deep: true,
			handler(newValue, oldValue) {
				
				for (const [index,fieldName] of Object.entries(newValue.fields)) {
					this.formData[fieldName] = newValue.list?.[newValue.selected]?.data[fieldName]
				}
			}
		}
	},
	computed:{
		formAction: function() {
			return `/settings/add/${this.company.label}`
		}
	},
	methods: {

		formatCamelCaseToText: function(sText){
			
			const sFormatText = sText.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
			
			return sFormatText.charAt(0).toUpperCase() + sFormatText.slice(1);

		},
		checkForm: async function (e) {

			this.errors = {};

			if (Object.keys(this.errors).length) {
				return false;
			}

			const response = await fetch(e.target.action,{
				method: 'post',
				body: JSON.stringify(this.formData),
				headers: {'Content-Type': 'application/json'}
			});
			
			const data = await response.json();

			if(data.error){
				this.errors['default'] = data.message;

				return;
			}

			this.company.list[data.data.id] = {
				data: {...JSON.parse(data.data.data)},
				name: data.data.name,
				type: data.data.type,
				id: data.data.id
			}

			this.company.selected = data.data.id
			
		}
	}


}