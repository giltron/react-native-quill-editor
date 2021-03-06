import React from 'react'
import { Dimensions, Platform, ViewStyle } from 'react-native'
import { WebView, WebViewMessageEvent } from 'react-native-webview'

type Props = {
  style?: ViewStyle
  defaultValue?: string
  options?: any
  onChange?: (html: string) => void
}

const Quill = (props: Props) => {
  const options = JSON.stringify({
    placeholder: '...',
    modules: {
      toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline'], ['image', 'code-block']],
    },
    ...props.options,
    theme: 'snow',
  })
  const injectedJavaScriptBeforeContentLoaded = `window.options=${options}`
  const injectedJavaScript = `document.querySelector('#editor').children[0].innerHTML="${props.defaultValue}"`

  const onMessage = (e: WebViewMessageEvent) => {
    const data = JSON.parse(e.nativeEvent.data)
    if (data.type === 'onChange') {
      props.onChange(data.message)
    }
  }

  let webviewSource = Platform.OS === 'ios' ? {html: require('./assets/quill')() } : { uri: 'file:///android_asset/quill.html'}
  return (
    <WebView
      onMessage={onMessage}
      source={webviewSource}
      javaScriptEnabled
      injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
      injectedJavaScript={injectedJavaScript}
      style={{ height: Dimensions.get('window').height - 42, width: Dimensions.get('window').width, ...props.style }}
    />
  )
}

Quill.defaultProps = {
  style: {},
  defaultValue: '',
  onChange: () => {},
  options: {},
}

export default Quill
