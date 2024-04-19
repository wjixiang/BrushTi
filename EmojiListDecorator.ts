import { EditorView, WidgetType } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import {
  StateField,
  Transaction,
  RangeSetBuilder,
} from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
} from "@codemirror/view";

// 定义一个WidgetType的子类，用于创建自定义的HTML元素
export class EmojiWidget extends WidgetType {
  toDOM(view: EditorView): HTMLElement {
    const div = document.createElement("span");
    div.innerText = "👉"; // 将圆点替换为"👉"
    return div;
  }
}

// 定义一个状态字段，用于管理装饰集
export const emojiListField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    // 使用RangeSetBuilder来构建新的装饰集
    const builder = new RangeSetBuilder<Decoration>();

    syntaxTree(tr.state).iterate({
      enter(node) {
        if (node.name === "ListItem") {
          // 定位无序列表的圆点位置
          const listCharFrom = node.from;
          builder.add(
            listCharFrom,
            listCharFrom + 1,
            Decoration.replace({ widget: new EmojiWidget() })
          );
        }
      },
    });

    return builder.finish();
  },
  provide: f => EditorView.decorations.from(f)
});

// 使用该状态字段创建一个编辑器扩展
const emojiListExtension = [emojiListField];
export { emojiListExtension };
// 创建编辑器实例时，将emojiListExtension作为扩展传入
// 例如:
// new EditorView({
//   state: EditorState.create({
//     doc: myDocument,
//     extensions: [emojiListExtension, ...其他扩展],
//   }),
//   parent: document.getElementById('editor'),
// })
