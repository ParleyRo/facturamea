export default {
	template: `
		<form 
			method="post"
			:action="formAction"
			@submit.prevent="checkForm"
			
		>
			<div class="columns is-multiline is-mobile is-align-items-end">

				<div v-for="(data, fieldName, index) in fields" :key="data.id" class="column is-half">

					<div class="field">
						<label class="mb-2">{{data.data.formatedFieldName}}</label>
						<div class="control is-small pt-1">
							<input 
								class="input is-small" 
								v-model="data.value" 
								type="text" 
								:placeholder="data.data.formatedFieldName + ' ...'"
								:required="data.isRequired ? true : false"
							>
						</div>
					</div>

				</div>
			
			</div>
			
			<div class="columns">
				<div class="column">
					<div class="control">
						<button class="button is-link pl-6 pr-6">Submit</button>
					</div>
				</div>
			</div>
			
		</form>
	`,
	data() {
				
		let fields = {};

		this.fieldsNames.forEach(fieldName => fields[fieldName] = {
			value: this.data[fieldName] || '',
			data: {
				formatedFieldName: this.formatCamelCaseToText(fieldName)
			}
		});

		fields.companyName['isRequired'] = true;

		return {
			errors: {},
			fields: fields
		}
			
	},
	props: {
		data: Object,
		fieldsNames: Array,
		type: String
	},
	watch: { 
      	data: function(newVal, oldVal) { 

			const isEmpty = !Object.keys(newVal).length;
			const oList =  isEmpty ? this.fields : newVal;

			for (let fieldName in oList) {
				if(this.fields[fieldName] != null){
					this.fields[fieldName].value = isEmpty ? '' : newVal[fieldName];
				}
			}

        }
    },
	computed:{
		formAction: function() {
			return `/settings/add/${this.type}`
		}
	},
	methods: {

		formatCamelCaseToText: function(sText){
			
			const sFormatText = sText.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
			
			return sFormatText.charAt(0).toUpperCase() + sFormatText.slice(1);

		},
		checkForm: async function (e) {

			this.errors = {};

			const oData = {};

			for (const fieldName in this.fields) {
				oData[fieldName] = this.fields[fieldName].value

				if (this.fields[fieldName].isRequired && !this.fields[fieldName].value) {
					this.errors[fieldName] = `${fieldName} required.`;
				}
			}
			
			if (Object.keys(this.errors).length) {
				console.log(this.errors)
				return false;
			}

			const response = await fetch(e.target.action,{
				method: 'post',
				body: JSON.stringify(oData),
				headers: {'Content-Type': 'application/json'}
			});
			
			const data = await response.json();

			if(data.error){
				this.errors['default'] = data.message;
			}
			
			if(data.state && data.state==='success'){
				this.$emit('submited', {
					data:data.data,
					type: this.type
				})
			}
			
		}
	}


}