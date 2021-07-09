<?php


class CriticalCSS_Enqueue
{
    use RapidLoad_Utils;

    private $file_system;

    private $dom;
    private $inject;
    private $options;

    private $job_data;
    private $data;
    private $warnings;

    public function __construct($job_data)
    {
        $this->file_system = new RapidLoad_FileSystem();

        $this->job_data = $job_data;

        $this->data = $job_data->data;
        $this->warnings = $this->job_data->get_warnings();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 20);
    }

    function update_content($state){

        if(isset($state['dom'])){
            $this->dom = $state['dom'];
        }

        if(isset($state['inject'])){
            $this->inject = $state['inject'];
        }

        if(isset($state['options'])){
            $this->options = $state['options'];
        }

        if($this->dom && $this->inject){

            $critical_css_content = $this->file_system->get_contents(CriticalCSS::$base_dir . '/' . $this->data );

            $critical_css_content = '<style id="' . str_replace('.css','', $this->data) . '" cpcss>' . $critical_css_content . '</style>';

            $header_content = $this->dom->find( 'head' )[0]->innertext;
            //$header_content = str_replace('</head>','', $header_content);

            $this->dom->find( 'head' )[0]->outertext = '<head>' . $critical_css_content . $header_content  . '</head>';

            return [
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options
            ];
        }

        return $state;

    }
}