<script lang="jsx">
import { Icon } from '@iconify/vue';

// 预设颜色
const colors = ['#409EFF', '#faad14', '#f5222d', '#52c41a'];
// const colors = ['#0d9488', '#f59e0b', '#0ea5e9', '#a3a3a3'];

const ColoredStatus = (props, ctx) => {
  return (
    <>
      <Icon
        inline={true}
        icon={props.icon || 'ci:dot-04-l'}
        class={props.iconClass}
        color={props.colors?.[~~props.status] ?? colors[~~props.status]}
      />
      <span>{ctx.slots.default?.()}</span>
    </>
  );
};

ColoredStatus.props = ['icon', 'status', 'colors', 'iconClass'];

export default ColoredStatus;
</script>
