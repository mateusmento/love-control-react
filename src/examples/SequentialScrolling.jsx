
import { List } from "../components/old/List";
import { ScrollLoading } from "../components/ScrollLoadingList";
import { comments } from "../data/comments";

export function fetchComments (page = 1, size = 10) {
  let start = (page-1) * size;
  let end = start + size;
  let results = comments.slice(start, end);
  return new Promise((res) => setTimeout(() => res(results), 2000));
};

export function SequentialScrolling() {
  return (
    <ScrollLoading next={fetchComments}>{
      ({listRef, lastItemRef, pages}) =>
        <List className="comments" ref={listRef}>
          {pages.map((items, page) =>
            <List flat key={page} items={items} trackBy="id" labelBy="email">
              <List.Await>I'm loading sweetheart...</List.Await>
              <List.Items filter={(_, i) => i !== items.length - 1 && page !== pages.length - 1}/>
              <List.Items filter={(_, i) => i === items.length - 1 && page === pages.length - 1} className="last-item" ref={lastItemRef}/>
            </List>
          )}
        </List>
    }</ScrollLoading>
  );
}
