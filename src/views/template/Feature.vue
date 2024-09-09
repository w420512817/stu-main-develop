<template>
  <n-card title="功能展示" class="h-full shadow-sm">
    <n-card title="权限控制" hoverable>
      <div pb-5>测试权限指令 v-auth</div>
      <n-space>
        <n-button v-auth="1001" type="primary" @click="test">测试权限</n-button>
        <n-button type="primary">测试</n-button>
        <clear-button color="#8a2be2" ghost label="iconButton" icon="zondicons:add-outline" />
        <n-button type="primary" @click="routeTest">路由测试</n-button>
      </n-space>
    </n-card>

    <n-card title="tab" hoverable mt-5>
      <div pb-5>动态设置tab状态</div>
      <n-space>
        <n-button type="primary" @click="setTitle('功能测试-更新')">更新title</n-button>
        <n-button type="primary" @click="closeCurrent">关闭当前</n-button>
        <n-button type="primary" @click="closeOther">关闭其他</n-button>
        <n-button type="primary" @click="closeRight">关闭右侧</n-button>
        <n-button type="primary" @click="closeLeft">关闭左侧</n-button>
      </n-space>
    </n-card>

    <n-card title="Unocss" hoverable class="mt-5">
      <div pb-5>
        <div pb-5>
          文档地址：
          <a href="https://uno.antfu.me/" target="_blank" un-text="primary" font-bold>https://uno.antfu.me</a>
        </div>
        <div>
          UnoCSS提供了流行实用程序优先框架Tailwind CSS、Windi CSS、Bootstrap、Tachyon
          等的通用超集。例如：ml-3(Tailwind)、ms-2(Bootstrap)、ma4(Tachyons)和mt-10px(Windi CSS) 都是有效的。
        </div>

        <div pt-5>
          .ma4 { margin: 1rem; } .ml-3 { margin-left: 0.75rem; } .ms-2 { margin-inline-start: 0.5rem; } .mt-10px {
          margin-top: 10px; }
        </div>
      </div>
      <div text-3 font-bold pb-5>间距</div>
      <div text="lime-700">
        <strong>一个间距单位等于0.25rem，在览器中默认转换为4px。</strong>
        全局预设间距别称，可使用类似p-sm、m-md、w-lg的类。
      </div>
      <div py-5>sm: '8px' md: '12px' lg: '16px' xl: '24px'</div>
      <div text-3 font-bold>属性样式</div>
      <div pt-5>
        @unocss/preset-attributify：
        <a
          href="https://github.com/unocss/unocss/tree/main/packages/preset-attributify"
          target="_blank"
          un-text="primary"
          font-bold
        >
          https://github.com/unocss/unocss/tree/main/packages/preset-attributify
        </a>
      </div>
      <button
        class="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono font-light py-2 px-4 rounded border-2 border-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        using Tailwind's utilities
      </button>
      <button
        bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
        text="sm white"
        font="mono light"
        p="y-2 x-4"
        m="y-5"
        border="2 rounded blue-200"
      >
        With attributify mode
      </button>

      <div text-3 font-bold>样式组</div>
      <div pt-5>
        @unocss/transformer-variant-group：
        <a href="https://windicss.org/features/variant-groups.html" target="_blank" un-text="primary" font-bold>
          https://windicss.org/features/variant-groups.html
        </a>
      </div>
      <div class="hover:(bg-gray-400 font-medium) font-(light mono) my-5">Variant Groups</div>

      <div text-3 font-bold>@apply、@screen、theme()</div>
      <div pt-5>
        @unocss/transformer-directives：
        <a href="https://uno.antfu.me/?s=guide:transformer-directives" target="_blank" un-text="primary" font-bold>
          https://uno.antfu.me/?s=guide:transformer-directives
        </a>
      </div>
      <div class="transformer-directives">with transformer-directives</div>

      <div text-3 font-bold pb-5>动画</div>
      <div select-none all:transition-400>
        <div text-6 fw100 animate-bounce-alt animate-count-infinite>unocss</div>
      </div>
    </n-card>

    <n-card title="数字处理" hoverable mt-5>
      <span text="5 success">{{ toThousands(3123456.12) }}</span>
    </n-card>

    <n-card title="图标使用" hoverable mt-5>
      <div pb-5>
        图标在线地址：
        <a href="https://icones.js.org/" target="_blank" un-text="primary" font-bold> https://icones.js.org </a>
      </div>
      <div pb-5>按此格式 <strong>{prefix}-{collection}-{icon}</strong> 使用图标，图标会自动按需引入</div>
      <n-space>
        <icon-zondicons:close text-8 />
        <icon-mdi:alarm-bell text-8 />
        <icon-carbon:asleep-filled text-8 />
        <icon-ion:arrow-back-circle-sharp text-8 />
      </n-space>

      <div py-5>
        使用<a href="https://github.com/iconify/iconify/tree/master/packages/vue" target="_blank" un-text="primary">
          @iconify/vue
        </a>
      </div>
      <n-space>
        <icon icon="logos:baker-street" text-8 />
        <icon icon="cif:cn" text-8 />
        <icon icon="cif:ad" text-8 />
      </n-space>

      <div py-5>使用render动态渲染</div>
      <n-space>
        <RenderIcon />
        <RenderIcon2 />
        <RenderCustomAvatar class="text-8" />
      </n-space>

      <div py-5>
        使用自定义SVG，将SVG图标资源放入assets/svg里面，然后按此格式
        <strong>icon-custom-svg名称</strong>使用，图标将会自动按需引入
      </div>
      <n-space>
        <icon-custom-avatar text-8 />
        <icon-custom-logo text-8 />
      </n-space>
    </n-card>
  </n-card>
</template>

<script setup>
import { toThousands } from '@common/utils/common';
import { Icon } from '@iconify/vue';
import { iconifyRender, customIconRender } from '@common/utils/common/icon';
import { useGo } from '@common/hooks/usePage';
import { useTabs } from '@common/hooks/useTabs';

const RenderIcon = iconifyRender('icon-park-solid:airplane', { color: '#ffb300', size: 32 });
const RenderIcon2 = iconifyRender('icon-park-solid:baby-feet', { color: '#ffb300', size: 32 });
const RenderCustomAvatar = customIconRender('avatar');

const { closeLeft, closeRight, closeOther, closeCurrent, setTitle } = useTabs();

const { go } = useGo();

function routeTest() {
  go({ name: 'TemplateTableList', query: { id: 1, type: 0 } });
}

function test() {
  // ..
}
</script>

<style>
.transformer-directives {
  --at-apply: my-5 b-(1 gray) w-200px h-50px leading-50px text-(center red);
}
</style>
