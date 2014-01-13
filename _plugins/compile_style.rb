require 'rubygems'
require 'less'
require 'fileutils'
module CompileStyle
	class SiteStyle < Jekyll::StaticFile
		def initialize(site, base, dir, name, less)
			@site = site
			@base = base
			@dir  ||= 'css'
			@name ||= 'style.css'
			@less = less
		end
		
		def write(dest)
			dest_path = destination(dest)
		
			parser = Less::Parser.new :paths => ['_less/']
			tree = parser.parse(@less)
			
			FileUtils.mkdir_p(File.dirname(dest_path))
			
			out_file = File.new(dest_path, "w")
			out_file.puts(tree.to_css(:compress => true))
			out_file.close
		end
	end

	class Generator < Jekyll::Generator
		priority :lowest
		
		def generate(site)
			root_less = '_less/style.less'
		
			less_file = File.open(root_less)

			css = SiteStyle.new(site, site.source, nil, nil, less_file.read)
			css.write(site.dest)
			site.static_files << css
		end
	end
end
