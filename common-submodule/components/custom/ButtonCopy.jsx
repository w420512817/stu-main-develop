import { useClipboard } from '@vueuse/core';
import { iconifyRender } from '@common/utils/common/icon';
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    name: {
      type: String,
      default: undefined
    }
  },
  setup(props) {
    const { copy, isSupported } = useClipboard();
    const handleClick = () => {
      if (isSupported) {
        copy(props.name);
        window.$message.success('复制成功');
      } else {
        window.$message.success('无剪切板权限');
      }
    };
    return {
      copy,
      isSupported,
      handleClick
    };
  },

  render() {
    return (
      <>
        {this.name ? (
          <>
            <span>{this.name}</span>
            <span style={{ cursor: 'pointer', marginLeft: '8px' }} onClick={this.handleClick}>
              {iconifyRender('carbon:copy')()}
            </span>
          </>
        ) : (
          '/'
        )}
      </>
    );
  }
});
