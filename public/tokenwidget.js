function tokenlessWidget(uuid, env = 'production', options = { domain: '.clicksign.com', show_files: false, pdf: false }) {
    const origin = window.location.hostname
  
    let subDomain = env;
    let baseDomain = options.domain
  
    if (env === 'production') {
      subDomain = 'app';
    } else if (/staging\d+/.test(env)) {
      subDomain = env.match(/\d+/)[0];
      baseDomain = '.clicksign.dev'
    }
  
    const baseUrl = `https://${subDomain}${baseDomain}/minimal_widget/${uuid}`
  
    let loader = 'Carregando Widget...'
    let mounted = false
    let wrapper = null
    let signed = false
  
    this.mount = ({containerId, textTemplate = 1}) => {
      wrapper = document.getElementById(containerId)
  
      if (wrapper === null) {
        mounted = false
        throw "It's not possible to render widget. 😵"
      }
  
      wrapper.innerHTML = loader
      getContent(wrapper, textTemplate)
      mounted = true
    }
  
    this.attach = (event, elID, method) => {
      const el = document.getElementById(elID)
      el.addEventListener(event, method)
    }
  
    this.sign = (info) => {
      if (!mounted) { throw 'Widget not mounted. 😵' }
      if (!signed) { throw "Can't sign without accept documents. 🤷🏻‍♂️" }
      if (requiredFields) { validateFields(info) }
  
      const prom_data = fetch(`${baseUrl}/sign`, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {
          Origin: origin,
          "Content-Type": "application/json"
        }
      })
      .then((response) => response.json())
      .then((data) => {
          switch (data.status) {
            case 'ok': return
            case 'error': throw data.error
            default: console.log("This shouldn't happend 🤭")
          }
        }
      )
      return prom_data
    }
  
    this.injectLoader = (el) => {
      loader = el
    }
  
    function validateFields(info) {
      const { signature } = info
      if (!signature) { throw "Object signature is required. 🤷🏻‍♂️" }
  
      const requiredAttributes = Object.keys(requiredFields)
        .filter((field) => requiredFields[field])
  
      if (!(requiredAttributes.every((attr) => signature[attr]))) {
        throw `Can't sign without required fields. 🤷🏻‍♂️ ${requiredAttributes}`
      }
    }
  
    function addCheckboxEventListener() {
      const checkbox = document.getElementById('cs-checkbox-sign')
      checkbox.addEventListener('change', () => {
        signed = !signed
      })
    }
  
    function createDocumentLink(doc, strMatch) {
      let filename = options.pdf ? doc.converted.name : doc.name;
      let download_url = options.pdf ? doc.converted.download_url : doc.download_url;
  
      let docLink = this.document.createElement('a');
      docLink.innerHTML = strMatch && `${strMatch[1]}`;
      docLink.className = 'cs-acceptance-preview';
      docLink.setAttribute('download', true);
      docLink.textContent = filename;
      docLink.href = download_url;
  
      return docLink;
    }
  
    function getContent(wrapper, contentId) {
      fetch(`${baseUrl}/content/${contentId}`, {
        headers: {
          Origin: origin,
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(({acceptance_text, documents, error, required_fields}) => {
        if (!documents) { throw error.message }
        requiredFields = required_fields
  
        wrapper.innerHTML = ''
  
        let checkbox = document.createElement('input')
        let textWrapper = document.createElement('span')
        let key = document.getElementById('key').value

        document.getElementById('showDoc').style.display = 'inline-block'
  
        checkbox.type = 'checkbox'
        checkbox.id = 'cs-checkbox-sign'
  
        textWrapper.className = 'cs-acceptance-text'
        const regex = /\(\((.[^\)\)]*)\)\)/g
  
        documents.forEach((doc) => {
          const strMatch = regex.exec(acceptance_text)
          let docLink = createDocumentLink(doc, strMatch)
  
          if ( options.show_files ) {
            wrapper.insertAdjacentHTML('beforeend', docLink.outerHTML)
            wrapper.insertAdjacentHTML('beforeend', '<br/>')
          }
           acceptance_text = acceptance_text.replace(strMatch && strMatch[0], docLink.outerHTML)
           document.getElementById('showDoc').setAttribute('href', `https://app.clicksign.com/minimal_widget/${key}/download/${doc.key}`)
        })
  
        textWrapper.insertAdjacentHTML('afterbegin', acceptance_text)
  
        wrapper.append(checkbox)
        wrapper.append(textWrapper)
        addCheckboxEventListener()
      })
    }
  }