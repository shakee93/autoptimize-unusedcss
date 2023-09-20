import React from 'react';
import {truncateMiddleOfURL} from "lib/utils";
import prettyBytes from "pretty-bytes";
import prettyMilliseconds from "pretty-ms";

// Props type for the TreeNode component
type TreeNodeProps = {
    node: CriticalChainTreeNodeType;
    isLastChild?: boolean;
    isRoot?: boolean;
};

// Props type for the Treeview component
type TreeviewProps = {
    data: CriticalChainTreeNodeType;
};

const TreeNode = ({ node, isLastChild = false, isRoot = false }: TreeNodeProps) => {
    return (
        <div className="relative pl-6">
            {!isRoot && (
                <>
                    <div className="absolute top-0 left-2 h-3 border-l border-gray-300"></div>
                    <div className="absolute top-3 left-2 w-3 border-t border-gray-300"></div>
                </>
            )}

            {(node.children && !isRoot) && (
                <div className="absolute top-2.5 left-2 h-full border-l border-gray-300"></div>
            )}

            {!isLastChild && !isRoot && (
                <div className="absolute top-2.5 left-2 h-full border-l border-gray-300"></div>
            )}

            <div className=" mb-1">
                <a href={node.request.url} target="_blank" rel="noopener noreferrer" className="inline-flex gap-1 text-xs text-brand-700 hover:text-purple-750">
                    <span> {truncateMiddleOfURL(node.request.url, 50, false)}</span>
                    <span className='text-brand-400'>{prettyBytes(node.request.transferSize)}</span>

                    {/* TODO: add time <span className='text-brand-400'>{prettyMilliseconds(node.request.endTime )}</span>*/}
                </a>
            </div>

            {node.children &&
                <div>
                    {Object.entries(node.children).map(([key, childNode], index, arr) => (
                        <TreeNode
                            key={childNode.request.url}
                            node={childNode}
                            isLastChild={index === arr.length - 1}
                        />
                    ))}
                </div>
            }
        </div>
    );
}

const Treeview = ({ data }: TreeviewProps) => {
    return (
        <div className="p-4">
            <TreeNode node={data} isRoot={true} />
        </div>
    );
}

export default Treeview;
